import express from "express";
import { generateToken } from "../controllers/stream.js";

const router = express.Router();

console.log("✅ Stream routes loaded");

router.get("/", (req, res) => {
  res.json({ message: "Stream route working" });
});

// Generate Stream token
router.get("/token/:userId", generateToken);

export default router;