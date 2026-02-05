import express from "express";
import { enhanceProfessionalSummary, enhanceJobDescription, uploadResume } from "../controllers/ai.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const aiRouter = express.Router();

aiRouter.route("/enhance-pro-sum").post(protect, enhanceProfessionalSummary);
aiRouter.route("/enhance-job-desc").post(protect, enhanceJobDescription);
aiRouter.route("/upload-resume").post(protect, uploadResume);

export default aiRouter;