import { Sparkle, Sparkles } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import api from "../configs/api.js";

const ProfeesionalSummary = ({ data, onChange, setResumeData }) => {
  const { token } = useSelector((state) => state.auth);
  const [isGenerating, setIsGenerating] = useState(false);

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
  return (
    <div className="space-y-4">
      <div className="flex item-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Profeesional Summary
          </h3>
          <p className="text-sm text-gray-500">
            Add a short summary of your professional experience and skills.
          </p>
        </div>
        <button
          disabled={isGenerating}
          onClick={generateSummary}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover: bg-purple-200 transition-colors disabled:opacity-50"
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
          onChange={(e) => onChange(e.target.value)}
          name=""
          id=""
          className="w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:border-blue-500 outline-none transition-colors resize-none"
          placeholder="Write a compelling professional summary of your skills and experience..."
        ></textarea>
        <p className="text-xs text-gray-500 max-w-4/5 mx-auto text-center">
          Keep it concise and focused on your key achievements and
          qualifications.
        </p>
      </div>
    </div>
  );
};

export default ProfeesionalSummary;
