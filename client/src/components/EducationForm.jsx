import { useState } from "react";
import {
  GraduationCap,
  Plus,
  Trash2,
  Calendar,
  School,
  BookOpen,
  Award,
} from "lucide-react";
import {
  validateEducation,
  stripNumbers,
  stripLetters,
} from "../utils/validation";

const EducationForm = ({ data, onChange }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const addEducation = () => {
    const newEducation = {
      institute: "",
      degree: "",
      field_of_study: "",
      graduation_date: "",
      gpa: "",
    };
    onChange([...data, newEducation]);
  };

  const removeEducation = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateEducation = (index, field, value) => {
    let filteredValue = value;
    if (
      field === "institute" ||
      field === "degree" ||
      field === "field_of_study"
    ) {
      filteredValue = stripNumbers(value);
    } else if (field === "gpa") {
      filteredValue = stripLetters(value);
    }

    const updated = [...data];
    updated[index] = { ...updated[index], [field]: filteredValue };
    onChange(updated);

    const errorKey = `${index}-${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  const handleBlur = (index, field) => {
    const errorKey = `${index}-${field}`;
    setTouched((prev) => ({ ...prev, [errorKey]: true }));

    const validationErrors = validateEducation(data[index]);
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
          <h3 className="text-xl font-bold text-slate-900">Education</h3>
          <p className="text-sm text-slate-500 font-medium">
            Add your academic background and certifications.
          </p>
        </div>
        <button
          onClick={addEducation}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all shadow-md shadow-green-900/10 active:scale-95"
        >
          <Plus size={18} />
          Add Education
        </button>
      </div>

      {data.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl py-16 flex flex-col items-center justify-center text-center px-6">
          <div className="size-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm mb-4">
            <GraduationCap size={32} />
          </div>
          <p className="font-bold text-slate-500 mb-1">
            No education entries yet
          </p>
          <p className="text-sm text-slate-400 font-medium max-w-xs">
            Showcase your degrees, diplomas, or relevant online courses.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {data.map((education, index) => (
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
                    Academic History
                  </h4>
                </div>
                <button
                  onClick={() => removeEducation(index)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  aria-label="Remove education"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <School size={14} className="text-slate-400" />
                    Institution Name
                  </label>
                  <input
                    type="text"
                    value={education.institute || ""}
                    onChange={(e) =>
                      updateEducation(index, "institute", e.target.value)
                    }
                    onBlur={() => handleBlur(index, "institute")}
                    className={getInputClassName(index, "institute")}
                    placeholder="e.g. Stanford University"
                  />
                  {renderError(index, "institute")}
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <BookOpen size={14} className="text-slate-400" />
                    Degree / Certification
                  </label>
                  <input
                    type="text"
                    value={education.degree || ""}
                    onChange={(e) =>
                      updateEducation(index, "degree", e.target.value)
                    }
                    onBlur={() => handleBlur(index, "degree")}
                    className={getInputClassName(index, "degree")}
                    placeholder="e.g. Bachelor of Science"
                  />
                  {renderError(index, "degree")}
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <GraduationCap size={14} className="text-slate-400" />
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={education.field_of_study || ""}
                    onChange={(e) =>
                      updateEducation(index, "field_of_study", e.target.value)
                    }
                    onBlur={() => handleBlur(index, "field_of_study")}
                    className={getInputClassName(index, "field_of_study")}
                    placeholder="e.g. Computer Science"
                  />
                  {renderError(index, "field_of_study")}
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <Calendar size={14} className="text-slate-400" />
                    Graduation Date
                  </label>
                  <input
                    type="date"
                    value={education.graduation_date || ""}
                    onChange={(e) =>
                      updateEducation(index, "graduation_date", e.target.value)
                    }
                    className={getInputClassName(index, "graduation_date")}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <Award size={14} className="text-slate-400" />
                    GPA / Grade
                  </label>
                  <input
                    type="text"
                    value={education.gpa || ""}
                    onChange={(e) =>
                      updateEducation(index, "gpa", e.target.value)
                    }
                    onBlur={() => handleBlur(index, "gpa")}
                    className={getInputClassName(index, "gpa")}
                    placeholder="e.g. 3.8 / 4.0 or 9.0 CGPA"
                  />
                  {renderError(index, "gpa")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationForm;
