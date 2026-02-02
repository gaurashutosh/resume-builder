import { Router } from "express";
import { getUserResumes,createResume,getResumeById,getPublicResumeById,updateResume,deleteResume } from "../controllers/resume.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import upload from "../utils/multer.js";

const resumeRouter = Router();

resumeRouter.route("/").get(verifyJWT, getUserResumes);
resumeRouter.route("/create").post(verifyJWT, createResume);
resumeRouter.route("/update/:resumeId").put(upload.single("image"),verifyJWT, updateResume);
resumeRouter.route("/delete/:resumeId").delete(verifyJWT, deleteResume);
resumeRouter.route("/get/:resumeId").get(verifyJWT, getResumeById);
resumeRouter.route("/public/:resumeId").get(getPublicResumeById);

export default resumeRouter;