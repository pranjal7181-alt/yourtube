process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";
import { Server } from "socket.io";
import dns from "node:dns/promises";

import userroutes from "./routes/auth.js";
import videoroutes from "./routes/video.js";
import likeroutes from "./routes/like.js";
import watchlaterroutes from "./routes/watchlater.js";
import historyrroutes from "./routes/history.js";
import commentroutes from "./routes/comment.js";
import streamroutes from "./routes/stream.js";
import downloadroutes from "./routes/download.js";
import subscriptionRoutes from "./Routes/subscription.js";
import translateRoutes from "./routes/translate.js";


dotenv.config({ path: "./.env" });

dns.setServers(["1.1.1.1", "8.8.8.8"]);

// =====================
// Environment Variables
// =====================

console.log("DB_URL:", process.env.DB_URL ? "Loaded" : "Missing");
console.log("STREAM_API_KEY:", process.env.STREAM_API_KEY);
console.log(
  "STREAM_SECRET:",
  process.env.STREAM_SECRET ? "Loaded" : "Missing"
);

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
  "EMAIL_PASS:",
  process.env.EMAIL_PASS ? "Loaded" : "Missing"
);

// =====================
// Express App
// =====================

const app = express();

app.use(cors());

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(bodyParser.json());

app.use("/uploads", express.static(path.join("uploads")));

app.use("/translate", translateRoutes);

app.get("/", (req, res) => {
  res.send("YouTube Backend is Working ✅");
});

// =====================
// Routes
// =====================

app.use("/user", userroutes);
app.use("/video", videoroutes);
app.use("/like", likeroutes);
app.use("/watch", watchlaterroutes);
app.use("/history", historyrroutes);
app.use("/comment", commentroutes);
app.use("/stream", streamroutes);
app.use("/download", downloadroutes);
app.use("/subscription", subscriptionRoutes);

// =====================
// Server
// =====================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// =====================
// Socket.io
// =====================

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined room ${roomId}`);
  });

  socket.on("send-message", ({ roomId, message, sender }) => {
    io.to(roomId).emit("receive-message", {
      sender,
      message,
    });
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

// =====================
// MongoDB
// =====================

mongoose
  .connect(process.env.DB_URL, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
    console.log("Database Name:", mongoose.connection.name);
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed");
    console.error(err);
  });