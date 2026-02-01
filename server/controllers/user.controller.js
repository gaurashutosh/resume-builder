import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      throw new ApiError(400, "User already exists");
    }

    const user = await User.create({ name, email, password });

    if(!user){
        throw new ApiError(400,"Something went wrong while registering user!");
    }


    res
      .status(201)
      .json(new ApiResponse(201, user, "User registered successfully"));
  } catch (error) {
    res.status(500).json(new ApiError(500,error.message ||"Something went wrong!"));
  }
});

const generateAccessToken = async (userId) => {
  return jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = async (userId) => {
  return jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};


//userLogin

const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ApiError(400, "All fields are required");
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(400, "Invalid email or password");
        }

        const isPasswordCorrect = await user.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            throw new ApiError(400, "Invalid email or password");
        }

        const accessToken = await generateAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id);

        return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(new ApiResponse(200, {user,accessToken,refreshToken}, "User logged in successfully"));
    } catch (error) {
        res.status(500).json(new ApiError(500, error.message ||"Something went wrong!"));
    }
})

const getUserById = asyncHandler(async (req, res) => {
    try {
       const userId = req.userId;

       //check if user exists
       const user = await User.findById(userId);
       if(!user){
           throw new ApiError(404,"User not found");
       }
       res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
    } catch (error) {
        res.status(500).json(new ApiError(500, error.message ||"Something went wrong!"));
    }
})








export { registerUser, generateAccessToken, generateRefreshToken };
