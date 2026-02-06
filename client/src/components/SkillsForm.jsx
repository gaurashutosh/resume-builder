import { useState } from "react";
import { Plus, Sparkles, X } from "lucide-react";
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
    <div className="space-y-4">
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          Skills
        </h3>
        <p className="text-sm text-gray-500">
          Add your technical and soft skills
        </p>
      </div>

      <div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a skill.."
            value={newSkill}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            maxLength={50}
            className={`flex-1 px-3 py-2 text-sm rounded-lg border outline-none focus:ring focus:ring-blue-500 ${
              error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          />

          <button
            onClick={addSkill}
            disabled={!newSkill.trim() || data.length >= 30}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="size-4" /> Add
          </button>
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        <p className="text-xs text-gray-400 mt-1 text-right">
          {data.length}/30 skills
        </p>
      </div>

      {data.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {data.map((skill, index) => (
            <span
              key={index}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
            >
              {skill}
              <button
                onClick={() => removeSkill(index)}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              >
                <X className="size-4" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <Sparkles className="w-10 h-10 mx-auto mb-2 text-gray-300" />
          <p className="text-sm font-medium text-gray-900">
            No skills added yet
          </p>
          <p className="text-xs text-gray-500">
            Add your skills to get started
          </p>
        </div>
      )}

      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Tip:</strong> Add 8-10 skills, including technical skills,
          soft skills, and tools you are proficient in.
        </p>
      </div>
    </div>
  );
};

export default SkillsForm;
