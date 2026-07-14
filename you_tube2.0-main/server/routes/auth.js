import express from "express";
import {
  login,
  updateprofile,
  updatetheme,
  verifyOtp,
} from "../controllers/auth.js";

const routes = express.Router();

routes.post("/login", login);
routes.post("/verify-otp", verifyOtp);
routes.patch("/update/:id", updateprofile);
routes.patch("/theme/:id", updatetheme);

export default routes;