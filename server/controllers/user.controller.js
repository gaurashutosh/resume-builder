import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import { options } from "../utils/constants.js";

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  return token;
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({ name, email, password });

  if (!user) {
    throw new ApiError(400, "Something went wrong while registering user!");
  }

  const token = generateToken(user._id);
  user.password = undefined;

  res
    .status(201)
    .json(
      new ApiResponse(201, { user, token }, "User registered successfully"),
    );
});

//userLogin

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "Invalid email or password");
  }

  if (!user.comparePassword(password)) {
    throw new ApiError(400, "Invalid email or password");
  }

  const token = generateToken(user._id);
  user.password = undefined;

  return res
    .status(200)
    .json(new ApiResponse(200, { user, token }, "User logged in successfully"));
});


//getUserById
const getUserById = asyncHandler(async (req, res) => {
  const userId = req.userId;

  //check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  user.password = undefined;
  res.status(200).json(new ApiResponse(200, {user}, "User fetched successfully"));
});

export { registerUser, loginUser, getUserById  };
