import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    default: "Untitled Resume",
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  template: {
    type: String,
    default: "classic",
  },
  accentColor: {
    type: String,
    default: "#3B82F6",
  },
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
},{timestamps:true, minimize:false});

export const Resume = mongoose.model("Resume", resumeSchema);
