import { asyncHandler } from "../utils/asyncHandler.js";
import { Resume } from "../models/resume.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import imageKit from "../utils/imageKit.js";
import fs from "fs";

const getUserResumes = asyncHandler(async (req, res) => {
  const userId = req.userId;

  //retrieve all resumes of the user
  const resumes = await Resume.find({ userId });

  //return the resumes
  return res
    .status(200)
    .json(new ApiResponse(200, resumes, "Resumes fetched successfully"));
});

const createResume = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { title } = req.body;

  //create new resume
  const newResume = await Resume.create({ userId, title });
  return res
    .status(201)
    .json(new ApiResponse(201, newResume, "Resume created successfully"));
});

const deleteResume = asyncHandler(async (req, res) => {
  const { resumeId } = req.params;
  const userId = req.userId;

  //delete resume
  await Resume.findOneAndDelete({ _id: resumeId, userId });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Resume deleted successfully"));
});

const getResumeById = asyncHandler(async (req, res) => {
  const { resumeId } = req.params;
  const userId = req.userId;

  //retrieve resume by id
  const resume = await Resume.findOne({ _id: resumeId, userId });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  resume.__v = undefined;
  resume.createdAt = undefined;
  resume.updatedAt = undefined;

  return res
    .status(200)
    .json(new ApiResponse(200, resume, "Resume fetched successfully"));
});

const getPublicResumeById = asyncHandler(async (req, res) => {
  const { resumeId } = req.params;

  //retrieve resume by id
  const resume = await Resume.findOne({ _id: resumeId, isPublic: true });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, resume, "Resume fetched successfully"));
});

const updateResume = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { resumeId, resumeData, removeBackground } = req.params;
  const image = req.file;

  let resumeDataCopy = JSON.parse(resumeData);

  if (image) {

    const imageBufferData = fs.readFileSync(image.path);

    const response = await imageKit.files.upload({
      file: imageBufferData,
      fileName: image.originalname,
      folder: "user-resumes",
      transformation: {
        pre:
          "w-300, h-300, focus:face,z-0.75" +
          (removeBackground ? ",e-bgremove" : ""),
      },
    });

    resumeDataCopy.personalInfo.image = response.url;
  }

  const resume = await Resume.findByIdAndUpdate(
    { _id: resumeId, userId },
    resumeDataCopy,
    { new: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, resume, "Saved Successfully"));

  //update resume
  const updatedResume = await Resume.findOneAndUpdate(
    { _id: resumeId, userId },
    {
      title,
      isPublic,
      template,
      accentColor,
      professionalSummary,
      skills,
      personalInfo,
      workExperience,
      projects,
      education,
    },
    { new: true },
  );

  if (!updatedResume) {
    throw new ApiError(404, "Resume not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedResume, "Resume updated successfully"));
});

export {
  getUserResumes,
  createResume,
  deleteResume,
  getResumeById,
  getPublicResumeById,
  updateResume,
};
