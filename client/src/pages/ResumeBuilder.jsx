import {
  ArrowLeft,
  FolderIcon,
  GraduationCap,
  Sparkles,
  User,
  FileText,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Share2,
  Download,
  Eye,
  EyeOff,
  Layout,
  Palette,
  CheckCircle2,
  Save,
} from "lucide-react";
import ResumePreview from "../components/ResumePreview";
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
    accent_color: "#22c55e",
    public: false,
  });

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const sections = [
    { id: "personal", name: "Personal", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get(`/api/resumes/get/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.data.resume) {
        setResumeData(data.data.resume);
        document.title = `Editing: ${data.data.resume.title || "Resume"}`;
      }
    } catch (error) {
      toast.error("Failed to load resume");
      console.error(error);
    }
  };

  useEffect(() => {
    if (resumeId) loadExistingResume();
  }, [resumeId]);

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
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (data?.data?.resume) {
        setResumeData(data.data.resume);
        toast.success(
          `Resume is now ${!resumeData.public ? "Public" : "Private"}`,
        );
      }
    } catch (error) {
      toast.error("Failed to update visibility");
    }
  };

  const handleShare = () => {
    const resumeUrl = `${window.location.origin}/view/${resumeId}`;
    if (navigator.share) {
      navigator
        .share({
          url: resumeUrl,
          title: resumeData.title,
          text: `Take a look at my professional resume!`,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(resumeUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  const downloadResume = () => {
    window.print();
  };

  const saveResume = async () => {
    setIsSaving(true);
    try {
      const updatedResumeData = structuredClone(resumeData);
      const formData = new FormData();
      formData.append("resumeId", resumeId);

      const imageFile = resumeData.personal_info?.image;
      const hasNewImage = imageFile && typeof imageFile === "object";

      if (hasNewImage && updatedResumeData.personal_info) {
        delete updatedResumeData.personal_info.image;
      }

      formData.append("resumeData", JSON.stringify(updatedResumeData));
      if (removeBackground) formData.append("removeBackground", "yes");
      if (hasNewImage) formData.append("image", imageFile);

      const { data } = await api.put(
        `/api/resumes/update/${resumeId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (data?.data?.resume) {
        setResumeData(data.data.resume);
        toast.success("All changes saved!");
      }
    } catch (error) {
      toast.error("Error saving resume");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-['Inter',_sans-serif]">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 print:hidden">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              to="/app"
              className="p-2 hover:bg-slate-100 rounded-xl transition-all group"
              title="Back to Dashboard"
            >
              <ArrowLeft className="size-5 text-slate-500 group-hover:text-slate-900" />
            </Link>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <h1 className="text-sm font-black uppercase tracking-tighter text-slate-400">
                Editing Resume
              </h1>
              <p className="text-lg font-bold text-slate-900 truncate max-w-[200px] md:max-w-md">
                {resumeData.title || "Untitled Resume"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl mr-2">
              {sections.map((section, idx) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSectionIndex(idx)}
                  className={`size-8 flex items-center justify-center rounded-lg transition-all ${
                    activeSectionIndex === idx
                      ? "bg-white text-green-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                  title={section.name}
                >
                  <section.icon size={16} />
                </button>
              ))}
            </div>

            <button
              disabled={isSaving}
              onClick={saveResume}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              <Save size={18} />
              <span className="hidden sm:inline">Save Changes</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-6 md:p-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Form Side */}
          <div className="lg:col-span-5 space-y-6 print:hidden">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden min-h-[700px] flex flex-col">
              {/* Internal Stepper Header */}
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-lg">
                      <activeSection.icon size={20} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">
                      {activeSection.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
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
                </div>

                {/* Stepper Progress */}
                <div className="flex items-center gap-2">
                  {sections.map((_, idx) => (
                    <div
                      key={idx}
                      className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden"
                    >
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          idx <= activeSectionIndex ? "bg-green-500" : ""
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Scroll Area */}
              <div className="p-8 flex-1 overflow-y-auto max-h-[calc(100vh-350px)]">
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

              {/* Navigation Footer */}
              <div className="p-6 px-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <button
                  disabled={activeSectionIndex === 0}
                  onClick={() => setActiveSectionIndex((prev) => prev - 1)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 disabled:opacity-30 transition-all uppercase tracking-widest"
                >
                  <ChevronLeft size={18} />
                  Back
                </button>

                {activeSectionIndex < sections.length - 1 ? (
                  <button
                    onClick={() => setActiveSectionIndex((prev) => prev + 1)}
                    className="flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-slate-800 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                  >
                    Next Step
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={saveResume}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-green-700 transition-all shadow-lg shadow-green-900/10 active:scale-95 disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Finish Resume"}
                    <CheckCircle2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Preview Side */}
          <div className="lg:col-span-7">
            <div className="sticky top-[100px] space-y-6">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-100 rounded-[1.5rem] border border-slate-200 print:hidden">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Live Preview
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={changeResumeVisibility}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      resumeData.public
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "bg-purple-100 text-purple-700 border border-purple-200"
                    }`}
                  >
                    {resumeData.public ? (
                      <Eye size={14} />
                    ) : (
                      <EyeOff size={14} />
                    )}
                    {resumeData.public ? "Public" : "Private"}
                  </button>

                  {resumeData.public && (
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                    >
                      <Share2 size={14} /> Share
                    </button>
                  )}

                  <button
                    onClick={downloadResume}
                    className="flex items-center gap-2 px-4 py-1.5 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-md active:scale-95"
                  >
                    <Download size={14} /> Download
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-300/50 p-2 overflow-hidden ring-1 ring-slate-200">
                <div className="overflow-auto max-h-[800px] custom-scrollbar rounded-[2rem]">
                  <ResumePreview
                    data={resumeData}
                    template={resumeData.template}
                    accentColor={resumeData.accent_color}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;
