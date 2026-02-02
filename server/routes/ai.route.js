import { Router } from "express";
import { enhanceProfessionalSummary, enhanceJobDescription, uploadResume } from "../controllers/ai.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const aiRouter = Router();

aiRouter.route("/enhance-professional-summary").post(verifyJWT, enhanceProfessionalSummary);
aiRouter.route("/enhance-job-description").post(verifyJWT, enhanceJobDescription);
aiRouter.route("/upload-resume").post(verifyJWT, uploadResume);

export default aiRouter;