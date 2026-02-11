import { useState } from "react";
import { Plus, Sparkles, X, Lightbulb, CheckCircle2 } from "lucide-react";
import { validateSkill } from "../utils/validation";

const SkillsForm = ({ data, onChange }) => {
  const [newSkill, setNewSkill] = useState("");
  const [error, setError] = useState("");

  const addSkill = () => {
    const validationError = validateSkill(newSkill, data);
    if (validationError) {
      setError(validationError);
      return;
    }

    onChange([...data, newSkill.trim()]);
    setNewSkill("");
    setError("");
  };

  const removeSkill = (indexToRemove) => {
    onChange(data.filter((_, i) => i !== indexToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleChange = (e) => {
    setNewSkill(e.target.value);
    if (error) setError("");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h3 className="text-xl font-bold text-slate-900">Skills</h3>
        <p className="text-sm text-slate-500 font-medium">
          Highlight your core competencies and technical expertise.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 space-y-6 shadow-sm">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
            <Plus size={14} className="text-slate-400" />
            Add New Skill
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="e.g. React.js, Project Management, Figma.."
                value={newSkill}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                maxLength={50}
                className={`w-full px-5 py-3.5 bg-slate-50 border rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all text-sm font-semibold placeholder:text-slate-400 ${
                  error ? "border-red-500 ring-red-500/10" : "border-slate-100"
                }`}
              />
              {error && (
                <p className="text-red-500 text-[10px] font-bold mt-1 px-2 uppercase tracking-tight">
                  {error}
                </p>
              )}
            </div>

            <button
              onClick={addSkill}
              disabled={!newSkill.trim() || data.length >= 30}
              className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              Add Skill
            </button>
          </div>
          <div className="flex items-center justify-between px-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Maximum 30 skills
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {data.length} / 30
            </p>
          </div>
        </div>

        {data.length > 0 ? (
          <div className="pt-4 border-t border-slate-100">
            <div className="flex flex-wrap gap-2.5">
              {data.map((skill, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-2 px-4 py-2 text-sm font-bold bg-green-50 text-green-700 rounded-xl border border-green-100/50 hover:bg-green-100 hover:border-green-200 transition-all cursor-default animate-in zoom-in duration-300"
                >
                  <CheckCircle2 size={14} className="text-green-500" />
                  {skill}
                  <button
                    onClick={() => removeSkill(index)}
                    className="ml-1 p-0.5 text-green-300 group-hover:text-green-600 hover:bg-green-200 rounded-lg transition-all"
                    aria-label={`Remove ${skill}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="pt-8 pb-4 text-center">
            <div className="size-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mx-auto mb-4">
              <Sparkles size={32} />
            </div>
            <p className="text-sm font-bold text-slate-400">
              Your skills list is empty. Start typing above!
            </p>
          </div>
        )}
      </div>

      <div className="bg-green-50/50 border border-green-100 p-4 rounded-2xl flex gap-3 items-start">
        <div className="p-2 bg-green-100 rounded-xl text-green-700">
          <Lightbulb size={18} />
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-black uppercase text-green-800 tracking-wider">
            Pro Tip
          </p>
          <p className="text-sm text-green-700 font-medium leading-relaxed">
            Include a mix of 8-12 technical skills, soft skills, and industry
            tools to boost your match rate with HR software.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkillsForm;
