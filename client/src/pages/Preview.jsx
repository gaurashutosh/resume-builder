import React from "react";
import { Link, useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import ResumePreview from "../components/ResumePreview";
import Loader from "../components/Loader";
import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import api from "../configs/api";

const Preview = () => {
  const { resumeId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);

  const loadResume = async () => {
    try {
      const {data} = await api.get(`/api/resumes/public/${resumeId}`);
      setResumeData(data.data.resume);
    } catch (error) {
      
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResume();
  }, [resumeId]);

  if (isLoading) {
    return <Loader />;
  }

  return resumeData ? (
    <div className="bg-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto py-10 px-4">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <ResumePreview
            data={resumeData}
            template={resumeData.template}
            accentColor={resumeData.accent_color}
            classes="py-4"
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
      <p className="text-center text-4xl md:text-6xl text-slate-400 font-light">
        Resume not found
      </p>
      <Link
        to="/app"
        className="mt-8 bg-green-500 hover:bg-green-600 text-white rounded-full px-8 py-3 ring-offset-2 ring-2 ring-green-400/20 flex items-center transition-all shadow-lg hover:shadow-green-500/20"
      >
        <ArrowLeftIcon className="mr-2 size-4" />
        Go to Home Page
      </Link>
    </div>
  );
};

export default Preview;
