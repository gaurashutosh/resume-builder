import React from "react";
import { Zap, Shield, Rocket, Layout } from "lucide-react";
import Title from "./Title";

const Features = () => {
  return (
    <section
      id="features"
      className="flex flex-col items-center my-24 scroll-mt-24 px-4 md:px-0"
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-100 rounded-full px-6 py-2 mb-4">
        <Zap size={16} fill="currentColor" />
        <span className="uppercase tracking-wider">The Process</span>
      </div>

      <Title
        title="Build Your Resume in Minutes"
        description="Our intuitive platform simplifies professional resume creation, helping you focus on your career story while we handle the design."
      />

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 mt-16 max-w-7xl mx-auto">
        <div className="relative group lg:w-1/2">
          <div className="absolute -inset-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"></div>
          <img
            className="relative rounded-2xl shadow-2xl border border-slate-200 transition-transform duration-500 group-hover:scale-[1.02]"
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png"
            alt="Resume builder interface preview"
            width={672}
            height={400}
            loading="lazy"
          />
        </div>

        <div className="flex flex-col gap-6 lg:w-1/2 max-w-md">
          <div className="p-6 bg-white hover:bg-slate-50 border border-slate-100 hover:border-violet-200 rounded-2xl shadow-sm hover:shadow-md transition-all group flex gap-5 cursor-default">
            <div className="flex-shrink-0 p-3 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                Privacy-First Design
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Your professional data is encrypted and yours alone. We
                prioritize security at every step.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white hover:bg-slate-50 border border-slate-100 hover:border-green-200 rounded-2xl shadow-sm hover:shadow-md transition-all group flex gap-5 cursor-default">
            <div className="flex-shrink-0 p-3 bg-green-50 text-green-600 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-colors">
              <Rocket size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                ATS-Optimized Export
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Land more interviews with resumes specifically formatted to pass
                through tracking systems flawlessly.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white hover:bg-slate-50 border border-slate-100 hover:border-orange-200 rounded-2xl shadow-sm hover:shadow-md transition-all group flex gap-5 cursor-default">
            <div className="flex-shrink-0 p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <Layout size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                Modern Templates
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Choose from a curated collection of designer templates that
                reflect your personal brand.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
