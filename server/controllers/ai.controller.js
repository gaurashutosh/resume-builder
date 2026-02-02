//for enhancing resume's professional summary
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Resume } from "../models/resume.model.js";
import ai from "../utils/ai.js";

const enhanceProfessionalSummary = asyncHandler(async (req, res) => {
  const { professionalSummary } = req.body;
  if (!professionalSummary?.trim()) {
    throw new ApiError(400, "Professional summary is required");
  }
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents: `Enhance this professional summary as in you are a professional resume writer in 1-2 sentences also highlight the key skills, experience and career goals. Make it compelling and ATS friendly and only return text no option or anything else: ${professionalSummary}`,
  });
  const enhancedSummary = response.text;
  console.log(enhancedSummary);
  if (!enhancedSummary) {
    throw new ApiError(400, "Professional summary enhancement failed");
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        enhancedSummary,
        "Professional summary enhanced successfully",
      ),
    );
});

const enhanceJobDescription = asyncHandler(async (req, res) => {
  const { jobDescription } = req.body;
  if (!jobDescription?.trim()) {
    throw new ApiError(400, "Job description is required");
  }
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents: `Enhance this job description as in you are a professional resume writer in 1-2 sentences also highlight the key skills, experience and career goals. Make it compelling and ATS friendly and only return text no option or anything else: ${jobDescription}`,
  });
  const enhancedJobDescription = response.text;
  console.log(enhancedJobDescription);
  if (!enhancedJobDescription) {
    throw new ApiError(400, "Job description enhancement failed");
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        enhancedJobDescription,
        "Job description enhanced successfully",
      ),
    );
});

const uploadResume = asyncHandler(async (req, res) => {
  const { resumeText, title } = req.body;
  const userId = req.userId;
  if (!resumeText) {
    throw new ApiError(400, "Resume is required");
  }

  const systemPrompt = `You are a professional resume writer. Your task is to extract the information from the resume text provided by the user and create a structured JSON object with the following fields:
    professionalSummary: {
    type: String,
    default: "",
  },
  skills: {
    type: [String],
    default: [],
  },

  personalInfo: {
    image: {
      type: String,
      default: "",
    },
    fullName: {
      type: String,
      default: "",
    },
    profession: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    linkedIn: {
      type: String,
      default: "",
    },
    gitHub: {
      type: String,
      default: "",
    },
    portfolioWebsite: {
      type: String,
      default: "",
    },
  },
  workExperience: [
    {
      company: {
        type: String,
        default: "",
      },
      position: {
        type: String,
        default: "",
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      endDate: {
        type: Date,
        default: Date.now,
      },
      description: {
        type: String,
        default: "",
      },
      isCurrentJob: {
        type: Boolean,
        default: false,
      },
    },
  ],
  projects: [
    {
      name: {
        type: String,
        default: "",
      },
      type: {
        type: String,
        default: "",
      },
      description: {
        type: String,
        default: "",
      },
    },
  ],
  education:[
    {
      institution:{
        type:String,
        default:"",
      },
      degree:{
        type:String,
        default:"",
      },
      fieldOfStudy:{
        type:String,
        default:"",
      },
      gradutionDate:{
        type:String,
        default:"",
      },
      gpa:{
        type:String,
        default:"",
      },
      
    }
  ]
}
    
    Return only the JSON object, without any additional text or explanation before or after.`;

  const userPrompt = `Here is the resume text:
    ${resumeText}
    
    Please extract the information and return the JSON object as specified.`;
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents: [
      {
        role: "system",
        parts: [
          {
            text: systemPrompt,
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: userPrompt,
          },
        ],
      },
    ],
    responseFormat: { type: "json_object" },
  });
  const extractedData = response.text;
  const parseData = JSON.parse(extractedData);
  console.log(parseData);

  const newResume = await Resume.create({
    userId,
    title,
    ...parseData,
  });
  if (!newResume) {
    throw new ApiError(400, "Resume upload failed");
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { resumeId: newResume._id },
        "Resume uploaded successfully",
      ),
    );
});

export { enhanceProfessionalSummary, enhanceJobDescription, uploadResume };
