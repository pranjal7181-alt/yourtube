import express from "express";
import { downloadVideo, getDownloadedVideos } from "../controllers/download.js";

const router = express.Router();

// Download a video
router.post("/:videoId", downloadVideo);

//Get all downloaded videos of a user
router.get("/:userId", getDownloadedVideos);

export default router;