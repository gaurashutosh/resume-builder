import React from "react";
import { Sparkles } from "lucide-react";


const Banner = () => {
  return (
    <div className="w-full py-3 bg-slate-900 flex justify-center items-center">
      <div className="flex items-center gap-3 text-xs md:text-sm font-semibold tracking-wide text-white">
        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-600 rounded-full text-[10px] md:text-xs">
          <Sparkles size={12} fill="currentColor" />
          NEW
        </span>
        <p className="text-balance">
          AI Resume Enhancement is now available for all users. Get started
          today!
        </p>
      </div>
    </div>
  );
};

export default Banner;

