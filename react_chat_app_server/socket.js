import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModel.js";
import Channel from "./models/ChannelModel.js";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CLIENT_BASE_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const handleDisconnect = (socket) => {
    console.log(`Client disconnected ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender.id);
    const recipientSocketId = userSocketMap.get(message.recipient);

    const createdMessage = await Message.create({
      sender: message.sender.id,
      recipient: message.recipient,
      messageType: message.messageType,
      content: message.content,
      fileUrl: message.fileUrl,
    });

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .populate("recipient", "id email firstName lastName image color");

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", messageData);
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }
  };

  const sendGroupMessage = async (message) => {
    try {
      const senderSocketId = userSocketMap.get(message.sender.id);
      const channelId = message.channelId;
      
      const createdMessage = await Message.create({
        sender: message.sender.id,
        recipient: null,
        messageType: message.messageType,
        content: message.content,
        fileUrl: message.fileUrl,
      });

      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email firstName lastName image color")
        .exec();

      const channelData = await Channel.findByIdAndUpdate(
        channelId,
        { $push: { messages: createdMessage._id } },
        { new: true }
      ).populate("members admin");

      const finalData = { ...messageData._doc, channelId: channelData._id };

      if (channelData && channelData.members) {
        channelData.members.forEach((member) => {
          const memberSocketId = userSocketMap.get(member._id.toString());
          if (memberSocketId) {
            io.to(memberSocketId).emit("receiveGroupMessage", finalData);
          }
        });

        const adminSocketId = userSocketMap.get(
          channelData.admin._id.toString()
        );
        
        if (adminSocketId) {
          io.to(adminSocketId).emit("receiveGroupMessage", finalData);
        }
      }
    } catch (error) {
      console.error("Error sending group message:", error);
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket id ${socket.id}`);
    } else {
      console.log("User not found");
    }

    socket.on("sendMessage", (data) => sendMessage(data));
    socket.on("sendGroupMessage", (data) => sendGroupMessage(data));
    socket.on("disconnect", () => handleDisconnect(socket));
  });
};

export default setupSocket;
