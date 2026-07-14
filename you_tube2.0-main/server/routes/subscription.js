import express from "express";
import {
  createOrder,
  verifyPayment,
} from "../Controllers/subscription.js";

const router = express.Router();

// Create Razorpay Order
router.post("/create-order", createOrder);

// Verify payment & update subscription
router.post("/verify-payment", verifyPayment);

export default router;