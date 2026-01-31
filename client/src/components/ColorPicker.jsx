import React, { useState } from "react";
import { Palette, Check } from "lucide-react";

const ColorPicker = ({ selectedColor, onChange }) => {
  const colors = [
    { name: "blue", value: "#3B82F6" },
    { name: "green", value: "#22C55D" },
    { name: "red", value: "#EF4444" },
    { name: "yellow", value: "#D97706" },
    { name: "purple", value: "#9333EA" },
    { name: "pink", value: "#EC4899" },
    { name: "orange", value: "#F59E0B" },
    { name: "teal", value: "#1E40AF" },
    { name: "indigo", value: "#4F46E5" },
    { name: "gray", value: "#6B7280" },
    { name: "black", value: "#000000" },
    { name: "white", value: "#FFFFFF" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 ring-purple-300 hover:ring transition-all duration-300 px-3 py-2 rounded-lg"
      >
        <Palette size={16} />
        <span className="max-sm:hidden">Accent</span>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-10 bg-white rounded-md border border-gray-200 shadow-xl p-3 w-72">
          <div className="grid grid-cols-5 gap-3">
            {colors.map((color) => (
              <div
                key={color.value}
                className="cursor-pointer group flex flex-col items-center gap-1"
                onClick={() => {
                  onChange(color.value);
                  setIsOpen(false);
                }}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${selectedColor === color.value ? "border-gray-400 scale-110" : "border-transparent group-hover:border-gray-200 group-hover:scale-105"}`}
                  style={{ backgroundColor: color.value }}
                >
                  {selectedColor === color.value && (
                    <Check
                      className={`w-4 h-4 ${color.name === "white" ? "text-black" : "text-white"}`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
