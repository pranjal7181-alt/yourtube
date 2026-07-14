import dotenv from "dotenv";
dotenv.config();

import Razorpay from "razorpay";
import User from "../Modals/Auth.js";
import { sendSubscriptionEmail } from "../Utils/sendEmail.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log(
  "RAZORPAY_KEY_SECRET:",
  process.env.RAZORPAY_KEY_SECRET ? "Loaded" : "Not Loaded"
);

// Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json(order);
  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

// Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    console.log("Payment Data:", req.body);

    const {
      userId,
      plan,
      amount,
      razorpay_payment_id,
    } = req.body;

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { plan },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("User Updated:", updatedUser.email);

    // Send email
    await sendSubscriptionEmail(
      updatedUser.email,
      updatedUser.name,
      plan,
      amount,
      razorpay_payment_id
    );

    console.log("Email sent successfully");

    return res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Verify Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};