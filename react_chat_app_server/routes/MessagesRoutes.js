import { Router } from "express";
import { getMessages, uploadFile } from "../controllers/MessagesController.js";
import { verifyAuthToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const upload = multer({ dest: "uploads/files/" });
const router = Router();

router.post("/getMessages", verifyAuthToken, getMessages);
router.post("/uploadFile", verifyAuthToken, upload.single("file"), uploadFile);

export default router;
