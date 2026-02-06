import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
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
    if (!data || data.trim() === "") {
      toast.error("Please write some summary text first to enhance");
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
    <div className="space-y-4">
      <div className="flex item-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Professional Summary
          </h3>
          <p className="text-sm text-gray-500">
            Add a short summary of your professional experience and skills.
          </p>
        </div>
        <button
          disabled={isGenerating}
          onClick={generateSummary}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {isGenerating ? "Generating..." : "AI Enhance"}
        </button>
      </div>

      <div className="mt-6">
        <textarea
          rows={7}
          value={data || ""}
          onChange={(e) => handleChange(e.target.value)}
          maxLength={600}
          className={`w-full p-3 px-4 mt-2 border text-sm rounded-lg focus:border-blue-500 outline-none transition-colors resize-none ${
            isOverLimit
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300"
          }`}
          placeholder="Write a compelling professional summary of your skills and experience..."
        ></textarea>
        <div className="flex justify-between items-center mt-1">
          {error ? (
            <p className="text-red-500 text-xs">{error}</p>
          ) : (
            <p className="text-xs text-gray-500">
              Keep it concise and focused on your key achievements.
            </p>
          )}
          <p
            className={`text-xs ${isOverLimit ? "text-red-500" : "text-gray-400"}`}
          >
            {charCount}/500
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfeesionalSummary;
