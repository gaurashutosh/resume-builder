import { asyncHandler } from "../utils/asyncHandler.js";
import { Resume } from "../models/resume.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import imageKit from "../utils/imageKit.js";
import { ApiError } from "../utils/apiError.js";
import fs from "fs";

//get User Resumes
const getUserResumes = asyncHandler(async (req, res) => {
  const userId = req.userId;

  //retrieve all resumes of the user
  const resumes = await Resume.find({ userId });

  //return the resumes
  return res
    .status(200)
    .json(new ApiResponse(200, resumes, "Resumes fetched successfully"));
});

//create Resume
const createResume = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { title } = req.body;

  //create new resume
  const newResume = await Resume.create({ userId, title });
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { resume: newResume },
        "Resume created successfully",
      ),
    );
});

//delete Resume
const deleteResume = asyncHandler(async (req, res) => {
  const { resumeId } = req.params;
  const userId = req.userId;

  //delete resume
  await Resume.findOneAndDelete({ _id: resumeId, userId });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Resume deleted successfully"));
});

//get Resume By Id
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
    .json(new ApiResponse(200, { resume }, "Resume fetched successfully"));
});

//get Public Resume By Id
const getPublicResumeById = asyncHandler(async (req, res) => {
  const { resumeId } = req.params;

  //retrieve resume by id
  const resume = await Resume.findOne({ _id: resumeId, public: true });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { resume }, "Resume fetched successfully"));
});

//update Resume
const updateResume = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { resumeId } = req.params;
  const { resumeData, removeBackground, title } = req.body;
  const image = req.file;

  let updatePayload = {};

  // Case 1: title update
  if (title) {
    updatePayload.title = title;
  }

  // Case 2: full resume update
  if (resumeData) {
    if (typeof resumeData === "string") {
      try {
        updatePayload = { ...updatePayload, ...JSON.parse(resumeData) };
      } catch (err) {
        throw new ApiError(400, "Invalid resume data format");
      }
    } else {
      updatePayload = { ...updatePayload, ...resumeData };
    }
  }

  // Image upload handling
  if (image) {
    const imageBufferData = fs.createReadStream(image.path);

    // Upload the original image first
    const response = await imageKit.files.upload({
      file: imageBufferData,
      fileName: `resume-${Date.now()}.png`,
      folder: "user-resumes",
    });


    // Apply transformations via URL
    // ImageKit URL format: https://ik.imagekit.io/<your_id>/path/to/image.png
    // With transformation: https://ik.imagekit.io/<your_id>/tr:w-400,h-400,fo-auto/path/to/image.png
    let finalUrl = response.url;

    // Build transformation string
    let transformations = "tr:w-400,h-400,fo-auto";
    if (removeBackground === "yes") {
      transformations += ",e-bgremove";
    }

    // Insert transformation into URL
    // URL structure: https://ik.imagekit.io/ID/user-resumes/file.png
    // Need to insert tr:... before /user-resumes/
    const urlParts = response.url.split("/user-resumes/");
    if (urlParts.length === 2) {
      // Ensure we add the transformation correctly
      // Result: https://ik.imagekit.io/ID/tr:w-400,h-400,fo-auto,e-bgremove/user-resumes/file.png
      finalUrl =
        urlParts[0] + "/" + transformations + "/user-resumes/" + urlParts[1];
    }

    if (!updatePayload.personal_info) {
      updatePayload.personal_info = {};
    }
    updatePayload.personal_info.image = finalUrl;
  }

  const resume = await Resume.findOneAndUpdate(
    { _id: resumeId, userId },
    updatePayload,
    { new: true },
  );

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { resume }, "Resume saved successfully"));
});

export {
  getUserResumes,
  createResume,
  deleteResume,
  getResumeById,
  getPublicResumeById,
  updateResume,
};
