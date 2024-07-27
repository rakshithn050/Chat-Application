import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Sender is required"],
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  messageType: {
    type: String,
    enum: ["text", "file"],
    required: true,
  },
  content: {
    type: String,
    validate: {
      validator: function (v) {
        return this.messageType === "text" ? !!v : true;
      },
      message: "Content is required for text messages",
    },
  },
  fileUrl: {
    type: String,
    validate: {
      validator: function (v) {
        return this.messageType === "file" ? !!v : true;
      },
      message: "File URL is required for file messages",
    },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

MessageSchema.pre("validate", function (next) {
  if (this.messageType === "text" && !this.content) {
    this.invalidate("content", "Content is required for text messages");
  } else if (this.messageType === "file" && !this.fileUrl) {
    this.invalidate("fileUrl", "File URL is required for file messages");
  }
  next();
});

const Message = mongoose.model("Messages", MessageSchema);

export default Message;
