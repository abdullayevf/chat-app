import { Router, Response } from "express";
import { CustomRequest } from "@/types";
import { login, register } from "@/modules/auth/auth.controller";
import { authenticate } from "@/middleware/auth";

const router = Router();

router.post("/login", login);
router.post("/register", register)

router.get("/test", (req: CustomRequest, res: Response): any => res.json({ message: "Test route works!" }));

router.get("/protected", authenticate, (req: CustomRequest, res: Response): any => {
    res.json({ message: "Protected route works!", user: req.user });
})


export default router;
