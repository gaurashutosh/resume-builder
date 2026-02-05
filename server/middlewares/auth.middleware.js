import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";

const protect = asyncHandler((req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Check if token exists
  if (!token || token === "null" || token === "undefined") {
    throw new ApiError(401, "Unauthorized - No token provided");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validate decoded data
    if (!decoded.userId) {
      throw new ApiError(401, "Unauthorized - Invalid token structure");
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    // Provide specific error messages
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Session expired - Please login again");
    } else if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid token - Please login again");
    } else {
      throw new ApiError(401, "Unauthorized - Authentication failed");
    }
  }
});

export { protect };
