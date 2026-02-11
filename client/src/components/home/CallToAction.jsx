import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section id="cta" className="w-full max-w-6xl mx-auto px-6 mb-32 mt-12">
      <div className="relative overflow-hidden bg-slate-900 rounded-3xl py-16 px-10 sm:px-20 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 size-96 bg-green-500/20 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to build your career?
          </h2>
          <p className="text-lg text-slate-300">
            Join thousands of professionals who have used our AI to land their
            dream jobs at top companies.
          </p>
        </div>

        <Link
          to="/app?state=register"
          className="relative z-10 flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-green-900/20 hover:-translate-y-0.5 group"
          aria-label="Get started builder now"
        >
          <span>Build My Resume</span>
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
