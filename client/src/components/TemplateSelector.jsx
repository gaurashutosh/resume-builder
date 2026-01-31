import { Check, Layout } from "lucide-react";
import React, { useState } from "react";

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const templates = [
    {
      id: "classic",
      name: "Classic",
      preview:
        "A clean traditional resume fromat with clear sections and professional typography ",
    },
    {
      id: "modern",
      name: "Modern",
      preview:
        "A modern and professional resume with a clean and modern design",
    },
    {
      id: "minimal",
      name: "Minimal",
      preview: "A minimalistic resume with a clean and modern design",
    },
    {
      id: "minimal-image",
      name: "Minimal Image",
      preview:
        "A minimalistic resume with an image and a clean and modern design",
    },
  ];
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 hover:ring transition-all duration-300 px-3 py-2 rounded-lg"
      >
        <Layout size={14} />
        <span className="max-sm:hidden">Select Template</span>
      </button>
      {isOpen && (
        <div className="absolute top-full w-72 bg-white p-3 mt-2 space-y-3 z-10 rounded-md border border-gray-200 shadow-sm">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => {
                onChange(template.id);
                setIsOpen(false);
              }}
              className={`relative p-3 border rounded-md cursor-pointer transition-all duration-300 w-full text-left ${selectedTemplate === template.id ? "bg-blue-100" : "border-gray-300 hover:border-gray-400 hover:bg-gray-100"}`}
            >
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2">
                  <div className="size-5 bg-blue-400 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white " />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <h4 className="font-medium text-gray-800">{template.name}</h4>
                <div className="mt-2 pt-2 bg-blue-50 rounded text-xs text-gray-500 italic">
                  {template.preview}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
