import { Router } from "express";
import { authenticate } from "@/middleware/auth";
import { getMessages, deleteMessage } from "@/modules/message/message.controller";

const router = Router();

/**
 * GET /api/messages
 * Fetch message history (protected)
 * Query params:
 *   - limit: number of messages (default 50, max 100)
 *   - before: ISO timestamp for pagination
 */
router.get("/", authenticate, getMessages);

/**
 * DELETE /api/messages/:id
 * Delete a specific message (protected, owner only)
 */
router.delete("/:id", authenticate, deleteMessage);

export default router;

