//for enhancing resume's professional summary
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Resume } from "../models/resume.model.js";
import { ai } from "../utils/ai.js";

const enhanceProfessionalSummary = asyncHandler(async (req, res) => {
  const { userContent } = req.body;
  if (!userContent) {
    throw new ApiError(400, "User content is required");
  }
  const response = await ai.chat.completions.create({
    model: process.env.GEMINI_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a professional resume writer. Your task is to enhance the professional summary of the user in 1-2 sentences also highlight the key skills, experience and career goals. Make it compelling and ATS friendly and only return text no option or anything else",
      },
      { role: "user", content: userContent },
    ],
  });
  const enhancedContent = response.choices[0].message.content;
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { enhancedContent },
        "Summary enhanced successfully",
      ),
    );
});

const enhanceJobDescription = asyncHandler(async (req, res) => {
  const { userContent } = req.body;
  if (!userContent) {
    throw new ApiError(400, "User content is required");
  }
  const response = await ai.chat.completions.create({
    model: process.env.GEMINI_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be in 1-2 sentences also highlighting key responsibilities and achievements. Use action verbs and quantifiable result where possible. Make it ATS friendly and only return text no option or anything else",
      },
      { role: "user", content: userContent },
    ],
  });

  const enhancedContent = response.choices[0].message.content;
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { enhancedContent },
        "Job description enhanced successfully",
      ),
    );
});

const uploadResume = asyncHandler(async (req, res) => {
  const { resumeText, title } = req.body;
  const userId = req.userId;

  if (!resumeText) {
    throw new ApiError(400, "Missing resume fields...");
  }

  const systemPrompt =
    "You are an expert AI Agent to extract data from resume.";
  const userPrompt = `Extract data from this resume: ${resumeText} 
  Provide data in the following JSON format with no additional text before and after:
  {
  professionalSummary: {
    type: String,
    default: "",
  },
  skills: {
    type: [String],
    default: [],
  },

  personal_info: {
    image: {
      type: String,
      default: "",
    },
    fullName: {
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
    profession: {
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
  
  `;

  const response = await ai.chat.completions.create({
    model: process.env.GEMINI_MODEL,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  const extractedData = response.choices[0].message.content;
  const parsedData = JSON.parse(extractedData);
  const newResume = await Resume.create({ userId, title, ...parsedData });

  res.json({ resumeId: newResume._id });
});

export { enhanceProfessionalSummary, enhanceJobDescription, uploadResume };
