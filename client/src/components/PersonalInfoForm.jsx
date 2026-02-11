import { useState } from "react";
import {
  BriefcaseBusiness,
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Sparkles,
  Camera,
} from "lucide-react";
import {
  validatePersonalInfo,
  stripNonPhone,
  stripNumbers,
} from "../utils/validation";

const PersonalInfoForm = ({
  data,
  onChange,
  removeBackground,
  setRemoveBackground,
}) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const textOnlyFields = ["full_name", "location", "profession"];

  const handleChange = (field, value) => {
    let filteredValue = value;
    if (textOnlyFields.includes(field)) {
      filteredValue = stripNumbers(value);
    } else if (field === "phone") {
      filteredValue = stripNonPhone(value);
    }
    onChange({ ...data, [field]: filteredValue });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validationErrors = validatePersonalInfo({
      ...data,
      [field]: data[field],
    });
    if (validationErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validationErrors[field] }));
    }
  };

  const fields = [
    {
      key: "full_name",
      label: "Full Name",
      icon: User,
      type: "text",
      required: true,
      placeholder: "e.g. John Doe",
    },
    {
      key: "profession",
      label: "Profession",
      icon: BriefcaseBusiness,
      type: "text",
      placeholder: "e.g. Senior Frontend Developer",
    },
    {
      key: "email",
      label: "Email Address",
      icon: Mail,
      type: "email",
      required: true,
      placeholder: "e.g. john@example.com",
    },
    {
      key: "phone",
      label: "Phone Number",
      icon: Phone,
      type: "tel",
      required: true,
      placeholder: "e.g. +1 234 567 890",
    },
    {
      key: "location",
      label: "Location",
      icon: MapPin,
      type: "text",
      placeholder: "e.g. New York, USA",
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      icon: Linkedin,
      type: "url",
      placeholder: "URL to LinkedIn profile",
    },
    {
      key: "github",
      label: "GitHub",
      icon: Github,
      type: "url",
      placeholder: "URL to GitHub profile",
    },
    {
      key: "website",
      label: "Portfolio",
      icon: Globe,
      type: "url",
      placeholder: "Link to your website",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h3 className="text-xl font-bold text-slate-900">Personal Details</h3>
        <p className="text-sm text-slate-500 font-medium">
          This information will be displayed prominently at the top of your
          resume.
        </p>
      </div>

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <label className="relative cursor-pointer group">
            {data.image ? (
              <div className="relative">
                <img
                  src={
                    typeof data.image === "string"
                      ? data.image
                      : URL.createObjectURL(data.image)
                  }
                  alt="Profile"
                  className="size-24 rounded-2xl object-cover ring-4 ring-white shadow-xl group-hover:opacity-90 transition-all border border-slate-100"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={20} />
                </div>
              </div>
            ) : (
              <div className="size-24 rounded-2xl bg-white border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-green-500 hover:text-green-600 transition-all hover:bg-green-50 shadow-sm">
                <Camera size={32} className="mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Photo
                </span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleChange("image", e.target.files[0])}
              className="hidden"
            />
          </label>

          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-700">
                  Remove Background
                </span>
                <div className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <Sparkles size={10} fill="currentColor" />
                  AI MAGIC
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={removeBackground}
                  onChange={() => setRemoveBackground((prev) => !prev)}
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Automatically isolate your portrait for a professional,
              distraction-free headshot. Best for resumes.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        {fields.map((field) => {
          const Icon = field.icon;
          const hasError = touched[field.key] && errors[field.key];
          return (
            <div
              key={field.key}
              className={`space-y-1.5 ${field.key === "full_name" || field.key === "profession" ? "md:col-span-2" : ""}`}
            >
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Icon size={14} className="text-slate-400" />
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <input
                  type={field.type}
                  value={data[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  onBlur={() => handleBlur(field.key)}
                  className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm font-medium ${
                    hasError
                      ? "border-red-500 ring-red-500/10"
                      : "border-slate-200"
                  }`}
                  placeholder={field.placeholder}
                />
              </div>
              {hasError && (
                <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase tracking-tight">
                  {errors[field.key]}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersonalInfoForm;
