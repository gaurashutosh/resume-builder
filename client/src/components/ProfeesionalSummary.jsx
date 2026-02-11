import { useState } from "react";
import { Sparkles, Loader2, Quote, Lightbulb } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import api from "../configs/api.js";
import { validateProfessionalSummary } from "../utils/validation";

const ProfeesionalSummary = ({ data, onChange, setResumeData }) => {
  const { token } = useSelector((state) => state.auth);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (value) => {
    onChange(value);

    const validationError = validateProfessionalSummary(value);
    if (validationError) {
      setError(validationError);
    } else {
      setError("");
    }
  };

  const generateSummary = async () => {
    if (!data?.trim()) {
      toast.error("Please write a summary draft first to enhance");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post(
        "/api/ai/enhance-pro-sum",
        { userContent: data },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success && response.data.data?.enhancedContent) {
        setResumeData((prev) => ({
          ...prev,
          professional_summary: response.data.data.enhancedContent,
        }));
        toast.success("Summary enhanced!");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to enhance summary",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const charCount = (data || "").length;
  const isOverLimit = charCount > 500;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 uppercase-label-system">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Professional Summary
          </h3>
          <p className="text-sm text-slate-500 font-medium">
            Capture your career essence in 2-3 powerful sentences.
          </p>
        </div>
        <button
          disabled={isGenerating}
          onClick={generateSummary}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-green-50 text-green-700 rounded-xl font-bold text-sm hover:bg-green-100 transition-all border border-green-200 active:scale-95 disabled:opacity-50"
        >
          {isGenerating ? (
            <Loader2 className="size-4 animate-spin text-green-600" />
          ) : (
            <Sparkles
              className="size-4 text-green-600 shadow-sm"
              fill="currentColor"
            />
          )}
          {isGenerating ? "Optimizing..." : "Optimize with AI"}
        </button>
      </div>

      <div className="relative group">
        <div className="absolute top-4 left-4 text-slate-200 group-focus-within:text-green-200 transition-colors pointer-events-none">
          <Quote size={40} fill="currentColor" />
        </div>
        <textarea
          rows={8}
          value={data || ""}
          onChange={(e) => handleChange(e.target.value)}
          maxLength={600}
          className={`w-full p-8 pt-12 bg-white border rounded-[2rem] text-sm font-medium leading-relaxed focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all resize-none shadow-sm ${
            isOverLimit || error
              ? "border-red-500 focus:ring-red-500/10"
              : "border-slate-200"
          }`}
          placeholder="Briefly describe your background, key strengths, and what you aim to achieve..."
        />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-4">
          <div className="flex items-center gap-2 group/tip">
            <div className="p-1.5 rounded-lg bg-green-50 text-green-600">
              <Lightbulb size={14} />
            </div>
            {error ? (
              <p className="text-red-500 text-[10px] font-black uppercase tracking-wider">
                {error}
              </p>
            ) : (
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                Focus on your most impactful achievements.
              </p>
            )}
          </div>

          <div
            className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
              isOverLimit
                ? "bg-red-50 border-red-100 text-red-500"
                : "bg-slate-50 border-slate-100 text-slate-400"
            }`}
          >
            {charCount} / 500 characters
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfeesionalSummary;
