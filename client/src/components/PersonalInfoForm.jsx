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
} from "lucide-react";

const PersonalInfoForm = ({
  data,
  onChange,
  removeBackground,
  setRemoveBackground,
}) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const fields = [
    {
      key: "full_name",
      label: "Full Name",
      icon: User,
      type: "text",
      required: true,
    },
    {
      key: "email",
      label: "Email Address",
      icon: Mail,
      type: "email",
      required: true,
    },
    {
      key: "phone",
      label: "Phone Number",
      icon: Phone,
      type: "tel",
      required: true,
    },
    { key: "location", label: "Location", icon: MapPin, type: "text" },
    {
      key: "profession",
      label: "Profession",
      icon: BriefcaseBusiness,
      type: "text",
    },
    { key: "linkedin", label: "LinkedIn", icon: Linkedin, type: "url" },
    { key: "github", label: "GitHub", icon: Github, type: "url" },
    { key: "website", label: "Personal Website", icon: Globe, type: "url" },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900">
        Personal Information
      </h3>
      <p className="text-sm text-gray-600">
        Get started by adding your personal information
      </p>

      <div className="flex items-center gap-6 mt-5 bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
        <label className="relative cursor-pointer group">
          {data.image ? (
            <div className="relative">
              <img
                src={
                  typeof data.image === "string"
                    ? data.image
                    : URL.createObjectURL(data.image)
                }
                alt="user-image"
                className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-md group-hover:opacity-90 transition-all"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-white font-bold">CHANGE</span>
              </div>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all">
              <User className="size-6" />
              <span className="text-[8px] font-bold mt-1 uppercase tracking-tighter">
                Upload
              </span>
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={(e) => handleChange("image", e.target.files[0])}
            className="hidden"
          />
        </label>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">
              Remove Background
            </span>
            <div className="bg-purple-100 text-purple-600 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <Sparkles className="size-2.5" />
              AI
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={removeBackground}
              onChange={() => setRemoveBackground((prev) => !prev)}
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 shadow-inner"></div>
            <span className="ms-3 text-xs font-medium text-slate-500">
              {removeBackground ? "Enabled" : "Disabled"}
            </span>
          </label>
        </div>
      </div>
      {fields.map((field) => {
        const Icon = field.icon;
        return (
          <div key={field.key} className="space-y-1 mt-5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Icon className="size-4" />
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type}
              value={data[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
              placeholder={`Enter your ${field.label.toLowerCase()}`}
              required={field.required}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PersonalInfoForm;
