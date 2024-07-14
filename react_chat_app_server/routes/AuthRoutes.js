import { Router } from "express";
import { login, signup, getUserInfo } from "../controllers/AuthController.js";
import { verifyAuthToken } from "../middlewares/AuthMiddleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/userInfo", verifyAuthToken, getUserInfo);

export default router;
