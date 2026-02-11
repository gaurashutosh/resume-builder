import { Check, Layout, Sparkles } from "lucide-react";
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
        "Traditional layout with professional typography for conservative industries.",
      accent: "from-blue-500 to-indigo-600",
    },
    {
      id: "modern",
      name: "Modern",
      preview:
        "A sleek, high-end design with profile image support and premium spacing.",
      accent: "from-green-500 to-emerald-600",
    },
    {
      id: "minimal",
      name: "Minimal",
      preview:
        "Clean, whitespace-focused design for a clutter-free professional look.",
      accent: "from-slate-700 to-slate-900",
    },
    {
      id: "minimal-image",
      name: "Minimalist + Photo",
      preview:
        "Combines the minimal aesthetic with a prominent personal profile photo.",
      accent: "from-purple-500 to-pink-600",
    },
  ];

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 12,
        left: rect.left,
      });
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:border-green-500 hover:text-green-600 transition-all duration-300 px-4 py-2.5 rounded-xl shadow-sm active:scale-95"
      >
        <Layout size={16} />
        <span className="hidden sm:inline uppercase tracking-widest">
          Select Template
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-slate-900/5 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="fixed w-80 bg-white/95 backdrop-blur-xl p-4 space-y-3 z-[9999] rounded-[2rem] border border-slate-200 shadow-2xl max-h-[450px] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
          >
            <div className="flex items-center gap-2 px-2 pb-2 mb-2 border-b border-slate-100">
              <Sparkles size={16} className="text-green-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Choose a Layout
              </span>
            </div>

            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onChange(template.id);
                  setIsOpen(false);
                }}
                className={`group relative p-4 border rounded-2xl cursor-pointer transition-all duration-300 w-full text-left overflow-hidden ${
                  selectedTemplate === template.id
                    ? "bg-green-50 border-green-200 ring-2 ring-green-100"
                    : "bg-white border-slate-100 hover:border-green-200 hover:bg-green-50/30"
                }`}
              >
                {/* Visual Accent */}
                <div
                  className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${template.accent} opacity-0 group-hover:opacity-100 transition-opacity`}
                />

                {selectedTemplate === template.id && (
                  <div className="absolute top-4 right-4 animate-in zoom-in spin-in-90 duration-300">
                    <div className="size-5 bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-900/20">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}

                <div className="relative">
                  <h4
                    className={`font-bold transition-colors ${selectedTemplate === template.id ? "text-green-800" : "text-slate-800"}`}
                  >
                    {template.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1 pr-6">
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
