import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    videoId: {
      type: String,
      required: true,
    },

    userPlan: {
      type: String,
      enum: ["free", "bronze", "silver", "gold"],
      default: "free",
    },

    downloadDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Download", downloadSchema);