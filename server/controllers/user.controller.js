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

  // Validate required fields
  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // Trim and validate inputs
  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (trimmedName.length < 2) {
    throw new ApiError(400, "Name must be at least 2 characters long");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  // Validate password strength
  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  // Check if user already exists (case-insensitive email check)
  const existedUser = await User.findOne({ email: trimmedEmail });
  if (existedUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  const user = await User.create({
    name: trimmedName,
    email: trimmedEmail,
    password,
  });

  if (!user) {
    throw new ApiError(500, "Failed to create user. Please try again");
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

  // Validate required fields
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Trim and validate email format
  const trimmedEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmedEmail)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  // Validate password length
  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  const user = await User.findOne({ email: trimmedEmail });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
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

  // Validate userId
  if (!userId) {
    throw new ApiError(401, "Unauthorized - Invalid token");
  }

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found or has been deleted");
  }

  // Remove password from response
  user.password = undefined;

  res
    .status(200)
    .json(new ApiResponse(200, { user }, "User fetched successfully"));
});

// Google OAuth Authentication
const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    throw new ApiError(400, "Google credential is required");
  }

  // Verify the Google token
  const { OAuth2Client } = await import("google-auth-library");
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (error) {
    throw new ApiError(401, "Invalid Google token");
  }

  const { sub: googleId, email, name, picture } = payload;

  // Check if user already exists
  let user = await User.findOne({ email: email.toLowerCase() });

  if (user) {
    // If user exists but was registered with password, link Google account
    if (user.authProvider === "local" && !user.googleId) {
      user.googleId = googleId;
      user.profilePicture = picture || user.profilePicture;
      await user.save();
    }
  } else {
    // Create new user with Google credentials
    user = await User.create({
      name,
      email: email.toLowerCase(),
      googleId,
      authProvider: "google",
      profilePicture: picture || "",
    });
  }

  const token = generateToken(user._id);
  user.password = undefined;

  res
    .status(200)
    .json(
      new ApiResponse(200, { user, token }, "Google authentication successful"),
    );
});

export { registerUser, loginUser, getUserById, googleAuth };
