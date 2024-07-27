import { Router } from "express";
import {
  createChannel,
  getPersonalizedChannels,
} from "../controllers/ChannelController.js";
import { verifyAuthToken } from "../middlewares/AuthMiddleware.js";

const router = Router();

router.post("/createChannel", verifyAuthToken, createChannel);
router.get(
  "/getPersonalizedChannels",
  verifyAuthToken,
  getPersonalizedChannels
);

export default router;
