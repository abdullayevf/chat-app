import { Response } from "express";
import { CustomRequest } from "@/types";
import { PrismaClient } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient();

/**
 * Get message history
 * @route GET /api/messages
 * @access Protected
 * @query limit - Number of messages to fetch (default: 50, max: 100)
 * @query before - Fetch messages before this timestamp (for pagination)
 */
export const getMessages = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // Extract query parameters
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
    const before = req.query.before as string | undefined;

    // Build query options
    const queryOptions: any = {
      take: limit,
      orderBy: { createdAt: "desc" }, // Most recent first
      include: {
        user: {
          select: {
            id: true,
            email: true,
          }
        }
      }
    };

    // If 'before' timestamp provided, fetch messages before that time
    if (before) {
      queryOptions.where = {
        createdAt: {
          lt: new Date(before)
        }
      };
    }

    // Fetch messages from database
    const messages = await prisma.message.findMany(queryOptions);

    // Return messages (reverse order so oldest is first for chat display)
    res.status(200).json({
      data: messages.reverse(),
      count: messages.length,
      hasMore: messages.length === limit // If we got full limit, there might be more
    });

  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ 
      message: "Failed to fetch messages",
      error: process.env.NODE_ENV === "development" ? error : undefined
    });
  }
};

/**
 * Delete a message
 * @route DELETE /api/messages/:id
 * @access Protected (owner only)
 */
export const deleteMessage = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user as JwtPayload;

    // Validate message ID
    if (!id) {
      res.status(400).json({ message: "Message ID is required" });
      return;
    }

    // Check if message exists
    const existingMessage = await prisma.message.findUnique({
      where: { id }
    });

    if (!existingMessage) {
      res.status(404).json({ message: "Message not found" });
      return;
    }

    // Authorization check: only message owner can delete
    if (existingMessage.userId !== user.id) {
      res.status(403).json({ 
        message: "Unauthorized: You can only delete your own messages" 
      });
      return;
    }

    // Delete the message
    await prisma.message.delete({
      where: { id }
    });

    console.log(`🗑️  Message deleted: ${id} by user ${user.id}`);

    res.status(200).json({ 
      message: "Message deleted successfully",
      deletedId: id
    });

  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ 
      message: "Failed to delete message",
      error: process.env.NODE_ENV === "development" ? error : undefined
    });
  }
};

