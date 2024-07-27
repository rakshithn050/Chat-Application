import mongoose from "mongoose";
import User from "../models/UserModel.js";
import { errorHandler } from "../utils/ErrorHandler.js";
import Message from "../models/MessagesModel.js";

export const getContacts = async (request, response, next) => {
  try {
    const { searchTerm } = request.body;

    if (
      !searchTerm ||
      typeof searchTerm !== "string" ||
      searchTerm.trim() === ""
    ) {
      return next(errorHandler(400, "Search term is required"));
    }

    const sanitizedSearchTerm = searchTerm
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(sanitizedSearchTerm, "i");

    const contacts = await User.find({
      $and: [
        { _id: { $ne: request.userId } },
        { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
      ],
    });

    return response.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getContactsForMessages = async (request, response, next) => {
  try {
    let userId = request.userId;
    userId = new mongoose.Types.ObjectId(userId);

    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      { $unwind: "$contactInfo" },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      { $sort: { lastMessageTime: -1 } },
    ]);

    return response.status(200).json({ contacts: contacts });
  } catch (error) {
    next(error);
  }
};

export const getAllContacts = async (request, response, next) => {
  try {
    const users = await User.find(
      { _id: { $ne: request.userId } },
      "firstName lastName email _id"
    );

    const contacts = users.map((user) => ({
      label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
      value: user._id,
    }));

    return response.status(200).json({ contacts: contacts });
  } catch (error) {
    next(error);
  }
};
