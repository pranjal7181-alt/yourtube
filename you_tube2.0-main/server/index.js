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
import subscriptionRoutes from "./routes/subscription.js";
import translateRoutes from "./routes/translate.js";

dotenv.config();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://glittery-bublanina-aa415f.netlify.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.send("YouTube Backend is Working ✅");
});

app.use("/user", userroutes);
app.use("/video", videoroutes);
app.use("/like", likeroutes);
app.use("/watch", watchlaterroutes);
app.use("/history", historyrroutes);
app.use("/comment", commentroutes);
app.use("/stream", streamroutes);
app.use("/download", downloadroutes);
app.use("/subscription", subscriptionRoutes);
app.use("/translate", translateRoutes);

if (mongoose.connection.readyState === 0) {
  mongoose
    .connect(process.env.DB_URL, {
      serverSelectionTimeoutMS: 10000,
    })
    .then(() => {
      console.log("MongoDB Connected");
      console.log("Database Name:", mongoose.connection.name);
    })
    .catch((error) => {
      console.error("MongoDB Connection Failed:", error);
    });
}

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
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
}

export default app;