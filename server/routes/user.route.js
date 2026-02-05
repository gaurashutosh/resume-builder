import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserById,
  googleAuth,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/google").post(googleAuth);
userRouter.route("/data").get(protect, getUserById);

export default userRouter;
