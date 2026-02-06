import { useState } from "react";
import { GraduationCap, Plus, Trash } from "lucide-react";
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
    // Reset errors for new entry
    setErrors({});
    setTouched({});
  };

  const removeEducation = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateEducation = (index, field, value) => {
    // Filter input based on field type
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

    // Clear error when user starts typing
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
    return `px-3 py-2 text-sm border rounded-lg outline-none focus:ring focus:ring-blue-500 ${
      hasError ? "border-red-500 focus:ring-red-500" : "border-gray-300"
    }`;
  };

  const renderError = (index, field) => {
    const errorKey = `${index}-${field}`;
    if (touched[errorKey] && errors[errorKey]) {
      return <p className="text-red-500 text-xs mt-1">{errors[errorKey]}</p>;
    }
    return null;
  };

  return (
    <div>
      <div className="flex item-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Education
          </h3>
          <p className="text-sm text-gray-500">Add your education details</p>
        </div>
        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
        >
          <Plus className="size-4" />
          Add Education
        </button>
      </div>
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-500" />
          <p>No education added yet</p>
          <p className="text-sm">Click "Add Education" to get started</p>
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          {data.map((education, index) => (
            <div
              className="p-4 border border-gray-200 rounded-lg space-y-3"
              key={index}
            >
              <div className="flex justify-between items-start">
                <h4>Education #{index + 1}</h4>
                <button
                  onClick={() => removeEducation(index)}
                  className="text-sm text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash className="size-4" />
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    value={education.institute || ""}
                    onChange={(e) =>
                      updateEducation(index, "institute", e.target.value)
                    }
                    onBlur={() => handleBlur(index, "institute")}
                    className={getInputClassName(index, "institute")}
                    placeholder="Institute Name *"
                  />
                  {renderError(index, "institute")}
                </div>

                <div>
                  <input
                    type="text"
                    value={education.degree || ""}
                    onChange={(e) =>
                      updateEducation(index, "degree", e.target.value)
                    }
                    onBlur={() => handleBlur(index, "degree")}
                    className={getInputClassName(index, "degree")}
                    placeholder="Degree *"
                  />
                  {renderError(index, "degree")}
                </div>

                <div>
                  <input
                    type="text"
                    value={education.field_of_study || ""}
                    onChange={(e) =>
                      updateEducation(index, "field_of_study", e.target.value)
                    }
                    onBlur={() => handleBlur(index, "field_of_study")}
                    className={getInputClassName(index, "field_of_study")}
                    placeholder="Field of Study"
                  />
                  {renderError(index, "field_of_study")}
                </div>

                <div>
                  <input
                    type="date"
                    value={education.graduation_date || ""}
                    onChange={(e) =>
                      updateEducation(index, "graduation_date", e.target.value)
                    }
                    className={getInputClassName(index, "graduation_date")}
                    placeholder="Graduation Date"
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={education.gpa || ""}
                  onChange={(e) =>
                    updateEducation(index, "gpa", e.target.value)
                  }
                  onBlur={() => handleBlur(index, "gpa")}
                  className={getInputClassName(index, "gpa")}
                  placeholder="GPA (e.g., 3.5 or 8.5)"
                />
                {renderError(index, "gpa")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationForm;
