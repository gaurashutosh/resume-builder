import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  GithubIcon,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
} from "lucide-react";

const ModernTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const primaryColor = accentColor || "#22c55e";

  return (
    <div className="max-w-[800px] mx-auto bg-white shadow-2xl min-h-[1100px] text-slate-800 font-['Inter',_sans-serif] leading-relaxed">
      {/* Premium Header */}
      <header className="relative bg-slate-900 px-10 py-12 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-2xl"></div>

        <div className="relative flex flex-col md:flex-row items-center gap-10">
          {data.personal_info?.image && (
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl border-2 border-white/20 translate-x-2 translate-y-2"></div>
              <img
                src={data.personal_info.image}
                alt={data.personal_info.full_name}
                className="relative size-32 rounded-3xl object-cover border-4 border-white/10 shadow-2xl"
              />
            </div>
          )}

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-black tracking-tight mb-2 uppercase">
              {data.personal_info?.full_name || "Your Name"}
            </h1>
            <p
              className="text-xl font-semibold opacity-90 tracking-wide uppercase mb-6"
              style={{ color: primaryColor }}
            >
              {data.personal_info?.profession || "Profession Name"}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 text-sm font-medium opacity-80">
              {data.personal_info?.email && (
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>{data.personal_info.email}</span>
                </div>
              )}
              {data.personal_info?.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>{data.personal_info.phone}</span>
                </div>
              )}
              {data.personal_info?.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{data.personal_info.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Social Bar */}
        {(data.personal_info?.linkedin ||
          data.personal_info?.github ||
          data.personal_info?.website) && (
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap justify-center md:justify-start gap-6 text-xs font-bold uppercase tracking-widest text-white/60">
            {data.personal_info?.linkedin && (
              <a
                href={data.personal_info.linkedin}
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <Linkedin size={14} />
                <span>LinkedIn</span>
              </a>
            )}
            {data.personal_info?.github && (
              <a
                href={data.personal_info.github}
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <GithubIcon size={14} />
                <span>GitHub</span>
              </a>
            )}
            {data.personal_info?.website && (
              <a
                href={data.personal_info.website}
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <Globe size={14} />
                <span>Portfolio</span>
              </a>
            )}
          </div>
        )}
      </header>

      <div className="grid grid-cols-12">
        {/* Main Column */}
        <div className="col-span-12 md:col-span-8 p-10 space-y-12">
          {/* Summary */}
          {data.professional_summary && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                  <Briefcase size={20} />
                </div>
                <h2 className="text-xl font-bold uppercase tracking-wider text-slate-800">
                  Profile
                </h2>
              </div>
              <p className="text-slate-600 font-medium leading-[1.7]">
                {data.professional_summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                  <Layers size={20} />
                </div>
                <h2 className="text-xl font-bold uppercase tracking-wider text-slate-800">
                  Experience
                </h2>
              </div>

              <div className="space-y-10">
                {data.experience.map((exp, index) => (
                  <div key={index} className="group relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-slate-100 group-hover:bg-slate-200 transition-colors"></div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-black transition-colors">
                          {exp.position}
                        </h3>
                        <p
                          className="font-bold text-sm uppercase tracking-wide"
                          style={{ color: primaryColor }}
                        >
                          {exp.company}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 tracking-tighter">
                        {formatDate(exp.start_date)} —{" "}
                        {exp.is_current ? "PRESENT" : formatDate(exp.end_date)}
                      </span>
                    </div>
                    {exp.description && (
                      <div className="text-slate-600 text-[14px] leading-relaxed mt-4 whitespace-pre-line font-medium border-l-2 border-slate-50 pl-4 py-1">
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                  <Award size={20} />
                </div>
                <h2 className="text-xl font-bold uppercase tracking-wider text-slate-800">
                  Project Highlights
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {data.projects.map((p, index) => (
                  <div
                    key={index}
                    className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all"
                  >
                    <h3 className="font-bold text-slate-900 mb-2">{p.name}</h3>
                    {p.description && (
                      <p className="text-slate-500 text-sm leading-relaxed font-medium">
                        {p.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Side Column */}
        <div className="col-span-12 md:col-span-4 bg-slate-50/30 p-10 space-y-12">
          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-6 border-b border-slate-200 pb-2">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-700 shadow-sm rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-6 border-b border-slate-200 pb-2">
                Education
              </h2>
              <div className="space-y-6 text-sm">
                {data.education.map((edu, index) => (
                  <div key={index} className="space-y-1">
                    <h3 className="font-bold text-slate-900 leading-tight">
                      {edu.degree}
                    </h3>
                    <p
                      className="text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-1"
                      style={{ color: primaryColor }}
                    >
                      {edu.institute}
                    </p>
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400">
                      <span>{formatDate(edu.graduation_date)}</span>
                      {edu.gpa && (
                        <span className="text-slate-500">GPA {edu.gpa}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Decorative tag */}
          <div className="opacity-10 pointer-events-none">
            <div className="text-[60px] font-black leading-none border-l-8 border-slate-900 pl-4 py-2">
              CV
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
