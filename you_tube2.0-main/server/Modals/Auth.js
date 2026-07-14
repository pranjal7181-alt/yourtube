import mongoose from "mongoose";

const userschema = mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String },
  channelname: { type: String },
  description: { type: String },
  image: { type: String },

  plan: {
    type: String,
    enum: ["free", "Bronze", "Silver", "Gold"],
    default: "free",
  },

  theme: {
    type: String,
    enum: ["light", "dark"],
    default: "dark",
  },

  otp: {
    type: String,
    default: null,
  },

  otpExpiry: {
    type: Date,
    default: null,
  },

  // Device tracking
  lastDevice: {
    type: String,
    default: "",
  },

  // NEW: Location tracking
  lastCity: {
    type: String,
    default: "",
  },

  lastState: {
    type: String,
    default: "",
  },

  joinedon: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("user", userschema);