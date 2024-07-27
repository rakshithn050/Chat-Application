import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import authRoutes from "./routes/AuthRoutes.js";
import contactRoutes from "./routes/ContactsRoutes.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import channelsRoutes from "./routes/ChannelsRoutes.js";
import setupSocket from "./socket.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const DB_URL = process.env.DB_URL;

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Serve static files from the "uploads/profiles" directory
app.use(
  "/uploads/profiles",
  express.static(path.join(__dirname, "uploads/profiles"))
);
app.use(
  "/uploads/files",
  express.static(path.join(__dirname, "uploads/files"))
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channels", channelsRoutes);

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

setupSocket(server);

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("MongoDB connection successful");
  })
  .catch((err) => {
    console.error(err);
  });

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    statusCode,
    message,
  });
});
