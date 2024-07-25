import { Router } from "express";
import { getMessages } from "../controllers/MessagesController.js";
import { verifyAuthToken } from "../middlewares/AuthMiddleware.js";

const router = Router();

router.post("/getMessages", verifyAuthToken, getMessages);

export default router;