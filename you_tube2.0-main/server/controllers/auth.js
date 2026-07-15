import geoip from "geoip-lite";
import crypto from "crypto";
import mongoose from "mongoose";

import sendOtpEmail from "../utils/sendOtpEmail.js";
import users from "../Modals/Auth.js";

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, name, image, device } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const forwardedIp = req.headers["x-forwarded-for"];

    const ip =
      (typeof forwardedIp === "string"
        ? forwardedIp.split(",")[0].trim()
        : null) ||
      req.socket?.remoteAddress ||
      "127.0.0.1";

    const geo = geoip.lookup(ip);

    const city = geo?.city || "Unknown";
    const state = geo?.region || "Unknown";

    const now = new Date();

    const indiaTime = new Date(
      now.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      })
    );

    const hour = indiaTime.getHours();

    const autoTheme =
      hour >= 10 && hour < 12 ? "light" : "dark";

    const existingUser = await users.findOne({ email });

    if (!existingUser) {
      const newUser = await users.create({
        email,
        name,
        image,
        theme: autoTheme,
        lastDevice: device,
        lastCity: city,
        lastState: state,
      });

      return res.status(201).json({
        result: newUser,
      });
    }

    const deviceChanged =
      existingUser.lastDevice &&
      existingUser.lastDevice !== device;

    const cityChanged =
      existingUser.lastCity &&
      existingUser.lastCity !== city;

    const stateChanged =
      existingUser.lastState &&
      existingUser.lastState !== state;

    if (deviceChanged || cityChanged || stateChanged) {
      const otp = crypto
        .randomInt(100000, 1000000)
        .toString();

      existingUser.otp = otp;
      existingUser.otpExpiry = new Date(
        Date.now() + 5 * 60 * 1000
      );

      await existingUser.save();

      await sendOtpEmail(
        existingUser.email,
        existingUser.name || "User",
        otp
      );

      return res.status(200).json({
        otpRequired: true,
        userId: existingUser._id,
        message: "OTP sent successfully",
      });
    }

    existingUser.lastDevice = device;
    existingUser.lastCity = city;
    existingUser.lastState = state;

    if (!existingUser.theme) {
      existingUser.theme = autoTheme;
    }

    await existingUser.save();

    return res.status(200).json({
      result: existingUser,
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      message: "Something went wrong",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// UPDATE PROFILE
export const updateprofile = async (req, res) => {
  const { id } = req.params;
  const { channelname, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid User Id",
    });
  }

  try {
    const updatedUser = await users.findByIdAndUpdate(
      id,
      {
        $set: {
          channelname,
          description,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// UPDATE THEME
export const updatetheme = async (req, res) => {
  const { id } = req.params;
  const { theme } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid User Id",
    });
  }

  if (!["light", "dark"].includes(theme)) {
    return res.status(400).json({
      message: "Theme must be light or dark",
    });
  }

  try {
    const updatedUser = await users.findByIdAndUpdate(
      id,
      {
        $set: {
          theme,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update Theme Error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// VERIFY OTP
export const verifyOtp = async (req, res) => {
  const { userId, otp, device } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      message: "Invalid User Id",
    });
  }

  try {
    const user = await users.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.otp || user.otp !== String(otp)) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (
      !user.otpExpiry ||
      new Date() > new Date(user.otpExpiry)
    ) {
      return res.status(400).json({
        message: "OTP Expired",
      });
    }

    const forwardedIp = req.headers["x-forwarded-for"];

    const ip =
      (typeof forwardedIp === "string"
        ? forwardedIp.split(",")[0].trim()
        : null) ||
      req.socket?.remoteAddress ||
      "127.0.0.1";

    const geo = geoip.lookup(ip);

    user.lastDevice =
      device ||
      req.headers["user-agent"] ||
      user.lastDevice;

    user.lastCity = geo?.city || "Unknown";
    user.lastState = geo?.region || "Unknown";

    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.status(200).json({
      success: true,
      result: user,
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};