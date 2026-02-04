import express from "express";
import { getUserResumes,createResume,getResumeById,getPublicResumeById,updateResume,deleteResume } from "../controllers/resume.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../utils/multer.js";

const resumeRouter = express.Router();

resumeRouter.route("/").get(protect, getUserResumes);
resumeRouter.route("/create").post(protect, createResume);
resumeRouter.route("/update/:resumeId").put(upload.single("image"),protect, updateResume);
resumeRouter.route("/delete/:resumeId").delete(protect, deleteResume);
resumeRouter.route("/get/:resumeId").get(protect, getResumeById);
resumeRouter.route("/public/:resumeId").get(getPublicResumeById);

export default resumeRouter;