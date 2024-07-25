import Message from "../models/MessagesModel.js";
import { errorHandler } from "../utils/ErrorHandler.js";

export const getMessages = async (request, response, next) => {
  try {
    const { receiverId } = request.body;
    const senderId = request.userId;

    if (!receiverId || !senderId) {
      return next(errorHandler(404, "User does not exist"));
    }

    const messages = await Message.find({
      $or: [
        { sender: senderId, recipient: receiverId },
        { sender: receiverId, recipient: senderId },
      ],
    }).sort({ timestamp: 1 });

    return response.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
