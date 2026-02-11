import {
  FilePenLine,
  PencilIcon,
  Plus,
  Trash2,
  Upload,
  UploadCloudIcon,
  X,
  Loader2,
  Sparkles,
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import api from "../configs/api";
import pdfToText from "react-pdftotext";

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [allResume, setAllResume] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const colors = [
    {
      bg: "bg-violet-50",
      text: "text-violet-600",
      border: "border-violet-100",
      hover: "hover:border-violet-300",
      accent: "bg-violet-600",
    },
    {
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-100",
      hover: "hover:border-amber-300",
      accent: "bg-amber-600",
    },
    {
      bg: "bg-rose-50",
      text: "text-rose-600",
      border: "border-rose-100",
      hover: "hover:border-rose-300",
      accent: "bg-rose-600",
    },
    {
      bg: "bg-sky-50",
      text: "text-sky-600",
      border: "border-sky-100",
      hover: "hover:border-sky-300",
      accent: "bg-sky-600",
    },
    {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
      hover: "hover:border-emerald-300",
      accent: "bg-emerald-600",
    },
  ];

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get("/api/resumes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllResume(data.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  const createResume = async (e) => {
    try {
      e.preventDefault();
      const { data } = await api.post(
        "/api/resumes/create",
        { title },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setAllResume([...allResume, data.data.resume]);
      setTitle("");
      setShowCreateResume(false);
      navigate(`/app/builder/${data.data.resume._id}`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  const uploadResume = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Please enter a resume title");
    if (!resume) return toast.error("Please select a resume file to upload");
    if (!resume.name.toLowerCase().endsWith(".pdf"))
      return toast.error("Please upload a PDF file");

    setIsLoading(true);
    try {
      const resumeText = await pdfToText(resume);
      const { data } = await api.post(
        "/api/ai/upload-resume",
        { title, resumeText },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTitle("");
      setResume(null);
      setShowUploadResume(false);
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const editTitle = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(
        `/api/resumes/update/${editResumeId}`,
        { title },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setAllResume((prev) =>
        prev.map((r) => (r._id === editResumeId ? { ...r, title } : r)),
      );
      setTitle("");
      setEditResumeId("");
      toast.success(data?.message);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  const deleteResume = async (resumeId) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      try {
        const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllResume((prev) => prev.filter((r) => r._id !== resumeId));
        toast.success(data.message);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            error.message ||
            "Something went wrong",
        );
      }
    }
  };

  useEffect(() => {
    loadAllResumes();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back, {user?.name?.split(" ")[0] || "User"}!
            </h1>
            <p className="text-slate-500 font-medium">
              Create a new resume or continue where you left off.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowUploadResume(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
            >
              <Upload size={18} />
              <span>Import PDF</span>
            </button>
            <button
              onClick={() => setShowCreateResume(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-md shadow-green-900/10 active:scale-95"
            >
              <Plus size={20} />
              <span>Create New</span>
            </button>
          </div>
        </header>

        <section>
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-lg font-bold text-slate-800">Your Resumes</h2>
            <span className="px-2.5 py-0.5 bg-slate-200 text-slate-600 rounded-full text-xs font-bold">
              {allResume.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {/* Create Card (Always visible) */}
            <button
              onClick={() => setShowCreateResume(true)}
              className="group h-[280px] bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-green-500 hover:bg-green-50/30 transition-all duration-300"
            >
              <div className="size-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                <Plus size={32} />
              </div>
              <p className="font-bold text-slate-500 group-hover:text-green-700">
                Start from Scratch
              </p>
            </button>

            {allResume.map((resume, index) => {
              const theme = colors[index % colors.length];
              return (
                <div
                  key={resume._id}
                  className={`group relative h-[280px] rounded-2xl border ${theme.border} ${theme.bg} p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer`}
                  onClick={() => navigate(`/app/builder/${resume._id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div
                      className={`p-3 rounded-xl bg-white shadow-sm ${theme.text}`}
                    >
                      <FilePenLine size={24} />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteResume(resume._id);
                        }}
                        className="p-2 bg-white text-slate-400 hover:text-red-600 rounded-lg shadow-sm transition-colors"
                        aria-label="Delete resume"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditResumeId(resume._id);
                          setTitle(resume.title);
                        }}
                        className="p-2 bg-white text-slate-400 hover:text-blue-600 rounded-lg shadow-sm transition-colors"
                        aria-label="Edit title"
                      >
                        <PencilIcon size={16} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2">
                      {resume.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <Calendar size={14} />
                      <span>
                        Updated{" "}
                        {new Date(resume.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`absolute inset-x-0 bottom-0 h-1.5 ${theme.accent} rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500`}
                  ></div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Modals */}
        {(showCreateResume || showUploadResume || editResumeId) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 scale-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {showCreateResume
                      ? "Create New Resume"
                      : showUploadResume
                        ? "Import from PDF"
                        : "Rename Resume"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateResume(false);
                      setShowUploadResume(false);
                      setEditResumeId("");
                      setTitle("");
                      setResume(null);
                    }}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form
                  onSubmit={
                    showCreateResume
                      ? createResume
                      : showUploadResume
                        ? uploadResume
                        : editTitle
                  }
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                      Resume Title
                    </label>
                    <input
                      autoFocus
                      onChange={(e) => setTitle(e.target.value)}
                      value={title}
                      type="text"
                      placeholder="e.g. Senior Software Engineer - Google"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-medium"
                      required
                    />
                  </div>

                  {showUploadResume && (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                        Select File
                      </label>
                      <label className="group flex flex-col items-center justify-center gap-3 w-full h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-green-500 hover:bg-green-50/30 transition-all">
                        {resume ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="p-3 bg-green-100 text-green-600 rounded-full">
                              <UploadCloudIcon size={24} />
                            </div>
                            <p className="font-bold text-green-700">
                              {resume.name}
                            </p>
                            <span className="text-xs text-green-600 font-medium">
                              Click to change
                            </span>
                          </div>
                        ) : (
                          <>
                            <UploadCloudIcon
                              size={40}
                              className="text-slate-300 group-hover:text-green-500 transition-colors"
                            />
                            <p className="font-bold text-slate-400 group-hover:text-green-700">
                              Choose PDF file
                            </p>
                          </>
                        )}
                        <input
                          type="file"
                          accept=".pdf"
                          hidden
                          onChange={(e) => setResume(e.target.files[0])}
                        />
                      </label>
                    </div>
                  )}

                  <button
                    disabled={isLoading}
                    className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-xl shadow-green-900/10 flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98]"
                  >
                    {isLoading && (
                      <Loader2 className="animate-spin" size={20} />
                    )}
                    {showCreateResume
                      ? "Create Resume"
                      : showUploadResume
                        ? isLoading
                          ? "Extracting..."
                          : "Start Building"
                        : "Save Changes"}
                  </button>

                  {showUploadResume && (
                    <p className="text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
                      <Sparkles size={12} className="text-green-500" />
                      We'll use AI to extract your professional history.
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
