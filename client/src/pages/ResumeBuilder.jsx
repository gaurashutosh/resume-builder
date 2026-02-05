import {
  ArrowLeftIcon,
  FolderIcon,
  GraduationCap,
  Sparkles,
  User,
  FileText,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Share2,
  Share2Icon,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import ResumePreview from "../components/ResumePreview";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ProfeesionalSummary from "../components/ProfeesionalSummary";
import { dummyResumeData } from "../assets/assets";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm";
import { useSelector } from "react-redux";
import api from "../configs/api.js";
import { toast } from "react-hot-toast";

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    projects: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  });

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get(`/api/resumes/get/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.data.resume) {
        setResumeData(data.data.resume);
        document.title = data.data.resume.title;
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    {
      id: "personal",
      name: "Personal Info",
      icon: User,
    },
    {
      id: "summary",
      name: "Summary ",
      icon: FileText,
    },
    {
      id: "experience",
      name: "Experience",
      icon: Briefcase,
    },
    {
      id: "education",
      name: "Education",
      icon: GraduationCap,
    },
    {
      id: "projects",
      name: "Projects",
      icon: FolderIcon,
    },
    {
      id: "skills",
      name: "Skills",
      icon: Sparkles,
    },
  ];

  const activeSection = sections[activeSectionIndex];

  //you might get errror here timestamp 2:28:02
  useEffect(() => {
    loadExistingResume();
  }, []);

  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append(
        "resumeData",
        JSON.stringify({ public: !resumeData.public }),
      );

      const { data } = await api.put(
        `/api/resumes/update/${resumeId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (data?.data?.resume) {
        setResumeData(data.data.resume);
        toast.success(data.message);
      }
    } catch (error) {
      console.error("Error changing resume visibility:", error.message);
      toast.error(
        error?.response?.data?.message || "Failed to change visibility",
      );
    }
  };

  const handleShare = () => {
    const frontendUrl = window.location.href.split("/app/")[0];
    const resumeUrl = frontendUrl + "/view/" + resumeId;
    if (navigator.share) {
      navigator.share({
        url: resumeUrl,
        text: `Check out my resume: ${resumeData.title}`,
      });
    } else {
      alert("Share not supported on this browser, copy the link manually");
    }
  };

  const downloadResume = () => {
    window.print();
  };

  const saveResume = async () => {
    const updatedResumeData = structuredClone(resumeData);
    const formData = new FormData();

    formData.append("resumeId", resumeId);

    // Store the image file before removing it from the data object
    const imageFile = resumeData.personal_info?.image;
    const hasNewImage = imageFile && typeof imageFile === "object";

    // Remove File object from personal_info before JSON.stringify (File objects serialize to {})
    if (hasNewImage && updatedResumeData.personal_info) {
      delete updatedResumeData.personal_info.image;
    }

    // Ensure personal_info exists in payload when uploading image (needed for backend)
    if (hasNewImage && !updatedResumeData.personal_info) {
      updatedResumeData.personal_info = {};
    }

    formData.append("resumeData", JSON.stringify(updatedResumeData));

    if (removeBackground) {
      formData.append("removeBackground", "yes");
    }

    // Append the actual image file separately
    if (hasNewImage) {
      formData.append("image", imageFile);
    }

    const { data } = await api.put(
      `/api/resumes/update/${resumeId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (data?.data?.resume) {
      setResumeData(data.data.resume);
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to={"/app"}
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all duration-300 print:hidden"
        >
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8 sm:grid-cols-1 ">
          {/* Left Panel - Form */}
          <div className="relative lg:col-span-5 rounded-lg print:hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1 relative overflow-hidden">
              {/* progress bar using activeSectionIndec */}

              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200" />
              <div
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                style={{
                  width: `${(activeSectionIndex / (sections.length - 1)) * 100}%`,
                }}
              />

              {/* section navigation */}

              <div className="flex justify-between item-center mb-6 border-b border-gray-300 py-1">
                <div className="flex  gap-2">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={(template) =>
                      setResumeData((prev) => ({ ...prev, template }))
                    }
                  />
                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(color) =>
                      setResumeData((prev) => ({
                        ...prev,
                        accent_color: color,
                      }))
                    }
                  />
                </div>
                <div className="flex item-center">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex((prevIndex) =>
                          Math.max(prevIndex - 1, 0),
                        )
                      }
                      className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                      disabled={activeSectionIndex === 0}
                    >
                      <ChevronLeft className="size-4" /> Previous
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setActiveSectionIndex((prevIndex) =>
                        Math.min(prevIndex + 1, sections.length - 1),
                      )
                    }
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 && `opacity-50`}`}
                    disabled={activeSectionIndex === sections.length - 1}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* form content */}
              <div className="space-y-6">
                {activeSection.id === "personal" && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personal_info: data,
                      }))
                    }
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}
                {activeSection.id === "summary" && (
                  <ProfeesionalSummary
                    data={resumeData.professional_summary}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        professional_summary: data,
                      }))
                    }
                    setResumeData={setResumeData}
                  />
                )}
                {activeSection.id === "experience" && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(data) =>
                      setResumeData((prev) => ({ ...prev, experience: data }))
                    }
                  />
                )}
                {activeSection.id === "education" && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(data) =>
                      setResumeData((prev) => ({ ...prev, education: data }))
                    }
                  />
                )}
                {activeSection.id === "projects" && (
                  <ProjectForm
                    data={resumeData.projects}
                    onChange={(data) =>
                      setResumeData((prev) => ({ ...prev, projects: data }))
                    }
                  />
                )}
                {activeSection.id === "skills" && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(data) =>
                      setResumeData((prev) => ({ ...prev, skills: data }))
                    }
                  />
                )}
              </div>
              <button
                onClick={() => {
                  toast.promise(saveResume, {
                    loading: "Saving...",
                    success: "Resume saved successfully",
                    error: "Failed to save resume",
                  });
                }}
                className="bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover-ring-green-400transition-all rounded-md px-6 py-2 mt-6 text-sm "
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-7 max-lg:mt-6">
            {/* -----buttons-------- */}
            <div className="flex justify-end items-center gap-3 mb-4 print:hidden">
              {resumeData.public && (
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 border border-purple-200 rounded-xl hover:shadow-sm transition-all shadow-sm"
                >
                  <Share2Icon className="size-4" /> Share
                </button>
              )}

              <button
                onClick={changeResumeVisibility}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl border transition-all shadow-sm
                  ${
                    resumeData.public
                      ? "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 border-blue-200"
                      : "bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 border-purple-200"
                  }`}
              >
                {resumeData.public ? (
                  <EyeIcon className="size-4" />
                ) : (
                  <EyeOffIcon className="size-4" />
                )}
                {resumeData.public ? "Public" : "Private"}
              </button>

              <button
                onClick={downloadResume}
                className="flex items-center gap-2 px-6 py-2 text-sm bg-gradient-to-br from-green-50 to-green-100 text-green-700 border border-green-200 rounded-xl hover:shadow-sm transition-all shadow-sm"
              >
                <DownloadIcon className="size-4" /> Download
              </button>
            </div>
            {/* -----resume preview-------- */}
            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
