import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Messages",
      },
    ],
  },
  {
    timestamps: true,
  }
);

ChannelSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

ChannelSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Channel = mongoose.model("Channel", ChannelSchema);

export default Channel;
