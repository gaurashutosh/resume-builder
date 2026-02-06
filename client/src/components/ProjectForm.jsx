import { useState } from "react";
import { Plus, Trash, FolderKanban } from "lucide-react";
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
    setErrors({});
    setTouched({});
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
    return `px-3 py-2 text-sm rounded-lg border outline-none focus:ring focus:ring-blue-500 ${
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
            Projects
          </h3>
          <p className="text-sm text-gray-500">Add your projects details</p>
        </div>
        <button
          onClick={addProject}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
        >
          <Plus className="size-4" />
          Add Project
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FolderKanban className="w-12 h-12 mx-auto mb-3 text-gray-500" />
          <p>No projects added yet</p>
          <p className="text-sm">Click "Add Project" to get started</p>
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          {data.map((project, index) => (
            <div
              className="p-4 border border-gray-200 rounded-lg space-y-3"
              key={index}
            >
              <div className="flex justify-between items-start">
                <h4>Project #{index + 1}</h4>
                <button
                  onClick={() => removeProject(index)}
                  className="text-sm text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash className="size-4" />
                </button>
              </div>

              <div className="grid gap-3">
                <div>
                  <input
                    type="text"
                    value={project.name || ""}
                    onChange={(e) =>
                      updateProject(index, "name", e.target.value)
                    }
                    onBlur={() => handleBlur(index, "name")}
                    className={getInputClassName(index, "name")}
                    placeholder="Project Name *"
                  />
                  {renderError(index, "name")}
                </div>

                <div>
                  <input
                    type="text"
                    value={project.type || ""}
                    onChange={(e) =>
                      updateProject(index, "type", e.target.value)
                    }
                    onBlur={() => handleBlur(index, "type")}
                    className={getInputClassName(index, "type")}
                    placeholder="Project Type"
                  />
                  {renderError(index, "type")}
                </div>

                <div>
                  <textarea
                    rows={4}
                    value={project.description || ""}
                    onChange={(e) =>
                      updateProject(index, "description", e.target.value)
                    }
                    onBlur={() => handleBlur(index, "description")}
                    className={`w-full px-3 py-2 text-sm rounded-lg resize-none border outline-none focus:ring focus:ring-blue-500 ${
                      touched[`${index}-description`] &&
                      errors[`${index}-description`]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Project Description"
                  />
                  {renderError(index, "description")}
                  <p className="text-xs text-gray-400 text-right">
                    {(project.description || "").length}/1000
                  </p>
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
