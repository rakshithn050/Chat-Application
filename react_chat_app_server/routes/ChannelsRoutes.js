import { Router } from "express";
import { createChannel } from "../controllers/ChannelController.js";
import { verifyAuthToken } from "../middlewares/AuthMiddleware.js";

const router = Router();

router.post("/createChannel", verifyAuthToken, createChannel);

export default router;
