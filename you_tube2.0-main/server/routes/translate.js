import express from "express";
import { translateComment } from "../controllers/translate.js";

const router = express.Router();

router.post("/", translateComment);

export default router;