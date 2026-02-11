import { useState } from "react";
import {
  Plus,
  Trash2,
  FolderKanban,
  Briefcase,
  Info,
  Layers,
} from "lucide-react";
import { validateProject } from "../utils/validation";

const ProjectForm = ({ data, onChange }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const addProject = () => {
    const newProject = {
      name: "",
      type: "",
      description: "",
    };
    onChange([...data, newProject]);
  };

  const removeProject = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateProject = (index, field, value) => {
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

    const validationErrors = validateProject(data[index]);
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Projects</h3>
          <p className="text-sm text-slate-500 font-medium">
            Showcase your best work and technical accomplishments.
          </p>
        </div>
        <button
          onClick={addProject}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all shadow-md shadow-green-900/10 active:scale-95"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      {data.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl py-16 flex flex-col items-center justify-center text-center px-6">
          <div className="size-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm mb-4">
            <FolderKanban size={32} />
          </div>
          <p className="font-bold text-slate-500 mb-1">
            No projects featured yet
          </p>
          <p className="text-sm text-slate-400 font-medium max-w-xs">
            Adding projects is a great way to demonstrate your skills in action.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {data.map((project, index) => (
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
                    Project Information
                  </h4>
                </div>
                <button
                  onClick={() => removeProject(index)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  aria-label="Remove project"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
                    <Briefcase size={14} className="text-slate-400" />
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={project.name || ""}
                    onChange={(e) =>
                      updateProject(index, "name", e.target.value)
                    }
                    onBlur={() => handleBlur(index, "name")}
                    className={getInputClassName(index, "name")}
                    placeholder="e.g. Portfolio Website"
                  />
                  {renderError(index, "name")}
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
                    <Layers size={14} className="text-slate-400" />
                    Project Type / Tech Stack
                  </label>
                  <input
                    type="text"
                    value={project.type || ""}
                    onChange={(e) =>
                      updateProject(index, "type", e.target.value)
                    }
                    onBlur={() => handleBlur(index, "type")}
                    className={getInputClassName(index, "type")}
                    placeholder="e.g. Full Stack (React & Node)"
                  />
                  {renderError(index, "type")}
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
                    <Info size={14} className="text-slate-400" />
                    Description
                  </label>
                  <div className="relative">
                    <textarea
                      rows={4}
                      value={project.description || ""}
                      onChange={(e) =>
                        updateProject(index, "description", e.target.value)
                      }
                      onBlur={() => handleBlur(index, "description")}
                      className={`w-full px-5 py-4 bg-slate-50/50 border rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm font-medium leading-relaxed resize-none ${
                        touched[`${index}-description`] &&
                        errors[`${index}-description`]
                          ? "border-red-500"
                          : "border-slate-200"
                      }`}
                      placeholder="Detail the problem you solved, your role, and the technologies used."
                    />
                    <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-400 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-slate-100 shadow-sm pointer-events-none">
                      {(project.description || "").length} / 1000
                    </div>
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

export default ProjectForm;
