import React, { useState } from "react";
import { Palette, Check, Sparkles } from "lucide-react";

const ColorPicker = ({ selectedColor, onChange }) => {
  const colors = [
    { name: "Emerald", value: "#22c55e" },
    { name: "Ocean", value: "#0ea5e9" },
    { name: "Indigo", value: "#6366f1" },
    { name: "Violet", value: "#8b5cf6" },
    { name: "Rose", value: "#f43f5e" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Teal", value: "#14b8a6" },
    { name: "Slate", value: "#475569" },
    { name: "Midnight", value: "#0f172a" },
    { name: "Crimson", value: "#b91c1c" },
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:border-green-500 hover:text-green-600 transition-all duration-300 px-4 py-2.5 rounded-xl shadow-sm active:scale-95"
      >
        <div
          className="size-4 rounded-full border border-white shadow-sm ring-1 ring-slate-200"
          style={{ backgroundColor: selectedColor }}
        />
        <span className="hidden sm:inline uppercase tracking-widest">
          Accent Color
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-slate-900/5 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed mt-3 z-[9999] bg-white/95 backdrop-blur-xl rounded-[2rem] border border-slate-200 shadow-2xl p-6 w-80 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 px-1 pb-4 mb-4 border-b border-slate-100">
              <Palette size={16} className="text-green-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Personalize Theme
              </span>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {colors.map((color) => (
                <button
                  key={color.value}
                  title={color.name}
                  className="relative group flex items-center justify-center p-0.5"
                  onClick={() => {
                    onChange(color.value);
                    setIsOpen(false);
                  }}
                >
                  <div
                    className={`size-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm ${
                      selectedColor === color.value
                        ? "border-slate-800 scale-110 shadow-md ring-4 ring-slate-100"
                        : "border-white hover:scale-110 hover:shadow-lg"
                    }`}
                    style={{ backgroundColor: color.value }}
                  >
                    {selectedColor === color.value && (
                      <Check
                        className={`w-4 h-4 animate-in zoom-in duration-300 ${
                          ["#FFFFFF", "#F59E0B"].includes(color.value)
                            ? "text-black"
                            : "text-white"
                        }`}
                      />
                    )}
                  </div>

                  {/* Tooltip hint */}
                  <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg pointer-events-none uppercase tracking-tighter">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-[10px] font-medium text-slate-400 text-center uppercase tracking-widest">
                Colors adapt to your chosen template
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ColorPicker;
