import { Router } from "express";
import {
  login,
  signup,
  getUserInfo,
  updateUserProfile,
  addUserProfileImage,
  deleteUserProfileImage,
  logout,
} from "../controllers/AuthController.js";
import { verifyAuthToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const uploadFile = multer({ dest: "uploads/profiles/" });
const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/userInfo", verifyAuthToken, getUserInfo);
router.put("/updateProfile", verifyAuthToken, updateUserProfile);
router.post(
  "/addProfileImage",
  verifyAuthToken,
  uploadFile.single("profileImage"),
  addUserProfileImage
);
router.delete("/deleteProfileImage", verifyAuthToken, deleteUserProfileImage);
router.post("/logout", logout);

export default router;
