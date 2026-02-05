import { Check, Layout } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const templates = [
    {
      id: "classic",
      name: "Classic",
      preview:
        "A clean traditional resume format with clear sections and professional typography",
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

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 hover:ring transition-all duration-300 px-3 py-2 rounded-lg"
      >
        <Layout size={14} />
        <span className="max-sm:hidden">Select Template</span>
      </button>
      {isOpen && (
        <>
          {/* Full screen backdrop - highest z-index */}
          <div
            className="fixed inset-0 z-[9998] bg-black/10"
            onClick={() => setIsOpen(false)}
          />
          {/* Fixed dropdown - escapes all stacking contexts */}
          <div
            className="fixed w-72 bg-white p-3 space-y-3 z-[9999] rounded-xl border border-gray-200 shadow-2xl max-h-80 overflow-y-auto"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
          >
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onChange(template.id);
                  setIsOpen(false);
                }}
                className={`relative p-3 border rounded-lg cursor-pointer transition-all duration-300 w-full text-left ${selectedTemplate === template.id ? "bg-blue-50 border-blue-300 ring-2 ring-blue-200" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"}`}
              >
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2">
                    <div className="size-5 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <h4 className="font-semibold text-gray-800">
                    {template.name}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {template.preview}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TemplateSelector;
