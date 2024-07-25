import Message from "../models/MessagesModel.js";
import { errorHandler } from "../utils/ErrorHandler.js";
import { renameSync, mkdirSync, unlinkSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the current file path and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getMessages = async (request, response, next) => {
  try {
    const { receiverId } = request.body;
    const senderId = request.userId;

    console.log(receiverId, senderId);

    if (!receiverId || !senderId) {
      return next(errorHandler(404, "Sender ID and Receiver ID are required"));
    }

    const messages = await Message.find({
      $or: [
        { sender: senderId, recipient: receiverId },
        { sender: receiverId, recipient: senderId },
      ],
    }).sort({ timestamp: 1 });

    return response.status(200).json({ messages: messages });
  } catch (error) {
    next(error);
  }
};

export const uploadFile = async (request, response, next) => {
  try {
    const { userId } = request;

    if (!userId) {
      return next(
        errorHandler(400, "You are not allowed to perform this action.")
      );
    }

    if (!request.file) {
      return next(errorHandler(400, "File is not present."));
    }

    const date = Date.now();
    const fileName = `uploads/files/${date}_${request.file.originalname
      .split(" ")
      .join("_")}`;
    const filePath = path.join(__dirname, fileName);
    const dirPath = path.dirname(filePath);

    // Check if the directory exists, if not, create it
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }

    // Move the file to the new location
    renameSync(path.normalize(request.file.path), path.normalize(filePath));

    return response.status(201).json({
      message: "File uploaded successfully",
      filePath: fileName,
    });
  } catch (error) {
    next(error);
  }
};
