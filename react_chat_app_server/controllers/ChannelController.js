import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Channel from "../models/ChannelModel.js";
import Message from "../models/MessagesModel.js";
import { errorHandler } from "../utils/ErrorHandler.js";

export const createChannel = async (request, response, next) => {
  try {
    const { name, members } = request.body;
    const userId = request.userId;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return next(
        errorHandler(404, "User not found, you cannot create a channel")
      );
    }

    if (!members || members.length === 0) {
      return next(errorHandler(400, "Members array cannot be empty"));
    }

    const checkValidMembers = await User.find({ _id: { $in: members } });
    if (checkValidMembers.length !== members.length) {
      return next(
        errorHandler(404, "Few members are not allowed to be a part of channel")
      );
    }

    const newChannel = new Channel({ name, members, admin: userId });
    await newChannel.save();

    return response
      .status(201)
      .json({ message: "Channel Created Successfully", channel: newChannel });
  } catch (error) {
    next(error);
  }
};

export const getPersonalizedChannels = async (request, response, next) => {
  try {
    let userId = request.userId;
    userId = new mongoose.Types.ObjectId(userId);

    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });

    return response.status(200).json({ channels });
  } catch (error) {
    next(error);
  }
};

export const getChannelMessages = async (request, response, next) => {
  try {
    let { channelId } = request.params;

    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName email _id image color",
      },
    });

    if (!channel) {
      return next(errorHandler(404, "Channel not found"));
    }

    const messages = channel.messages;

    return response.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
};
