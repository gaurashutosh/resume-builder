import { useState } from "react";
import {
  Plus,
  Sparkles,
  Briefcase,
  Loader2,
  Trash2,
  Calendar,
  Building2,
  UserCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../configs/api.js";
import { validateExperience } from "../utils/validation";

const ExperienceForm = ({ data, onChange }) => {
  const { token } = useSelector((state) => state.auth);
  const [enhancingIndex, setEnhancingIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const addExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false,
    };
    onChange([...data, newExperience]);
  };

  const removeExperience = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateExperience = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);

    const errorKey = `${index}-${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  const handleBlur = (index, field) => {
    const errorKey = `${index}-${field}`;
    setTouched((prev) => ({ ...prev, [errorKey]: true }));

    const validationErrors = validateExperience(data[index]);
    if (validationErrors[field]) {
      setErrors((prev) => ({ ...prev, [errorKey]: validationErrors[field] }));
    }
  };

  const getInputClassName = (index, field) => {
    const errorKey = `${index}-${field}`;
    const hasError = touched[errorKey] && errors[errorKey];
    return `w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm font-medium ${
      hasError ? "border-red-500 ring-red-500/10" : "border-slate-200"
    }`;
  };

  const renderError = (index, field) => {
    const errorKey = `${index}-${field}`;
    if (touched[errorKey] && errors[errorKey]) {
      return (
        <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase tracking-tight">
          {errors[errorKey]}
        </p>
      );
    }
    return null;
  };

  const enhanceDescription = async (index) => {
    const description = data[index]?.description;
    if (!description?.trim())
      return toast.error("Please write a description first to enhance");

    setEnhancingIndex(index);
    try {
      const response = await api.post(
        "/api/ai/enhance-job-desc",
        { userContent: description },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success && response.data.data?.enhancedContent) {
        updateExperience(
          index,
          "description",
          response.data.data.enhancedContent,
        );
        toast.success("Description enhanced!");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to enhance description",
      );
    } finally {
      setEnhancingIndex(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Experience</h3>
          <p className="text-sm text-slate-500 font-medium">
            Highlight your career journey and key achievements.
          </p>
        </div>
        <button
          onClick={addExperience}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all shadow-md shadow-green-900/10 active:scale-95"
        >
          <Plus size={18} />
          Add Experience
        </button>
      </div>

      {data.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl py-16 flex flex-col items-center justify-center text-center px-6">
          <div className="size-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm mb-4">
            <Briefcase size={32} />
          </div>
          <p className="font-bold text-slate-500 mb-1">
            Your career timeline is empty
          </p>
          <p className="text-sm text-slate-400 font-medium max-w-xs">
            Adding previous roles helps employers understand your professional
            growth.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {data.map((experience, index) => (
            <div
              className="group relative bg-white border border-slate-200 rounded-3xl p-6 md:p-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
              key={index}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                    #{index + 1}
                  </div>
                  <h4 className="text-lg font-bold text-slate-800">
                    Position Details
                  </h4>
                </div>
                <button
                  onClick={() => removeExperience(index)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  aria-label="Remove experience"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <Building2 size={14} className="text-slate-400" />
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={experience.company || ""}
                    onChange={(e) =>
                      updateExperience(index, "company", e.target.value)
                    }
                    onBlur={() => handleBlur(index, "company")}
                    className={getInputClassName(index, "company")}
                    placeholder="e.g. Google"
                  />
                  {renderError(index, "company")}
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <UserCircle size={14} className="text-slate-400" />
                    Position / Job Title
                  </label>
                  <input
                    type="text"
                    value={experience.position || ""}
                    onChange={(e) =>
                      updateExperience(index, "position", e.target.value)
                    }
                    onBlur={() => handleBlur(index, "position")}
                    className={getInputClassName(index, "position")}
                    placeholder="e.g. Senior Software Engineer"
                  />
                  {renderError(index, "position")}
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <Calendar size={14} className="text-slate-400" />
                    Start Date
                  </label>
                  <input
                    type="month"
                    value={experience.start_date || ""}
                    onChange={(e) =>
                      updateExperience(index, "start_date", e.target.value)
                    }
                    onBlur={() => handleBlur(index, "start_date")}
                    className={getInputClassName(index, "start_date")}
                  />
                  {renderError(index, "start_date")}
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <Calendar size={14} className="text-slate-400" />
                    End Date
                  </label>
                  <input
                    type="month"
                    value={experience.end_date || ""}
                    onChange={(e) =>
                      updateExperience(index, "end_date", e.target.value)
                    }
                    onBlur={() => handleBlur(index, "end_date")}
                    className={`${getInputClassName(index, "end_date")} disabled:opacity-50 disabled:bg-slate-50`}
                    disabled={experience.is_current}
                  />
                  {renderError(index, "end_date")}
                </div>
              </div>

              <div className="flex items-center mb-8">
                <label className="flex items-center group cursor-pointer select-none">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={experience.is_current || false}
                      onChange={(e) =>
                        updateExperience(index, "is_current", e.target.checked)
                      }
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-200 transition-all checked:border-green-600 checked:bg-green-600 focus:outline-none"
                    />
                    <Sparkles
                      className="absolute size-3.5 text-white opacity-0 peer-checked:opacity-100 left-[3px] pointer-events-none transition-opacity"
                      fill="currentColor"
                    />
                  </div>
                  <span className="ml-3 text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                    I am currently working in this role
                  </span>
                </label>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Job Description
                  </label>
                  <button
                    onClick={() => enhanceDescription(index)}
                    disabled={enhancingIndex === index}
                    className="flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all disabled:opacity-50 border border-green-200 text-xs font-bold active:scale-95"
                  >
                    {enhancingIndex === index ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Sparkles size={14} fill="currentColor" />
                    )}
                    {enhancingIndex === index
                      ? "Optimizing..."
                      : "Optimize with AI"}
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    value={experience.description || ""}
                    onChange={(e) =>
                      updateExperience(index, "description", e.target.value)
                    }
                    onBlur={() => handleBlur(index, "description")}
                    rows={6}
                    className={`w-full text-sm px-4 py-4 bg-slate-50/50 rounded-2xl resize-none border outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium leading-relaxed ${
                      touched[`${index}-description`] &&
                      errors[`${index}-description`]
                        ? "border-red-500"
                        : "border-slate-200"
                    }`}
                    placeholder="Briefly describe your responsibilities, key achievements, and the impact you made..."
                  />
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-100 shadow-sm pointer-events-none">
                    <span
                      className={`text-[10px] font-bold ${(experience.description || "").length > 1800 ? "text-red-500" : "text-slate-400"}`}
                    >
                      {(experience.description || "").length} / 2000
                    </span>
                  </div>
                  {renderError(index, "description")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
