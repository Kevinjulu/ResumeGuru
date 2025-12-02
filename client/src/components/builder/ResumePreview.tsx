import { useResume } from "@/lib/resumeContext";
import { templateColors } from "@shared/schema";
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

export function ResumePreview() {
  const { resumeData } = useResume();
  const { contactInfo, summary, experiences, education, skills, certifications, colorId } = resumeData;
  
  const currentColor = templateColors.find(c => c.id === colorId) || templateColors[0];

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden" style={{ aspectRatio: "8.5/11" }}>
      <div className="h-full flex flex-col text-[10px] leading-tight">
        <div 
          className="p-4 text-white"
          style={{ backgroundColor: currentColor.hex }}
        >
          <h1 className="text-lg font-bold">
            {contactInfo?.firstName || "Your"} {contactInfo?.lastName || "Name"}
          </h1>
          
          <div className="flex flex-wrap gap-3 mt-2 text-white/90">
            {contactInfo?.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span>{contactInfo.email}</span>
              </div>
            )}
            {contactInfo?.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>{contactInfo.phone}</span>
              </div>
            )}
            {(contactInfo?.city || contactInfo?.state) && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>
                  {[contactInfo.city, contactInfo.state].filter(Boolean).join(", ")}
                </span>
              </div>
            )}
            {contactInfo?.linkedin && (
              <div className="flex items-center gap-1">
                <Linkedin className="w-3 h-3" />
                <span>{contactInfo.linkedin}</span>
              </div>
            )}
            {contactInfo?.website && (
              <div className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span>{contactInfo.website}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          {summary && (
            <section>
              <h2 
                className="text-xs font-bold uppercase tracking-wide mb-1 pb-0.5 border-b"
                style={{ color: currentColor.hex, borderColor: currentColor.hex }}
              >
                Professional Summary
              </h2>
              <p className="text-gray-700">{summary}</p>
            </section>
          )}

          {experiences.length > 0 && (
            <section>
              <h2 
                className="text-xs font-bold uppercase tracking-wide mb-1 pb-0.5 border-b"
                style={{ color: currentColor.hex, borderColor: currentColor.hex }}
              >
                Work Experience
              </h2>
              <div className="space-y-2">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                        <p className="text-gray-600">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                      </div>
                      <span className="text-gray-500 text-[9px]">
                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    {exp.bullets.length > 0 && (
                      <ul className="mt-1 space-y-0.5 ml-3">
                        {exp.bullets.map((bullet, i) => (
                          <li key={i} className="text-gray-700 relative pl-2 before:absolute before:left-0 before:top-[0.4em] before:w-1 before:h-1 before:rounded-full before:bg-gray-400">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h2 
                className="text-xs font-bold uppercase tracking-wide mb-1 pb-0.5 border-b"
                style={{ color: currentColor.hex, borderColor: currentColor.hex }}
              >
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                        <p className="text-gray-600">{edu.school}{edu.location ? `, ${edu.location}` : ""}</p>
                      </div>
                      {edu.graduationDate && (
                        <span className="text-gray-500 text-[9px]">{edu.graduationDate}</span>
                      )}
                    </div>
                    {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                    {edu.honors && <p className="text-gray-600">{edu.honors}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2 
                className="text-xs font-bold uppercase tracking-wide mb-1 pb-0.5 border-b"
                style={{ color: currentColor.hex, borderColor: currentColor.hex }}
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-1.5 py-0.5 rounded text-[9px]"
                    style={{ backgroundColor: `${currentColor.hex}15`, color: currentColor.hex }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <h2 
                className="text-xs font-bold uppercase tracking-wide mb-1 pb-0.5 border-b"
                style={{ color: currentColor.hex, borderColor: currentColor.hex }}
              >
                Certifications
              </h2>
              <div className="space-y-1">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex justify-between">
                    <div>
                      <span className="font-medium text-gray-900">{cert.name}</span>
                      {cert.issuer && <span className="text-gray-600"> - {cert.issuer}</span>}
                    </div>
                    {cert.date && <span className="text-gray-500 text-[9px]">{cert.date}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {!summary && experiences.length === 0 && education.length === 0 && skills.length === 0 && (
            <div className="h-full flex items-center justify-center text-gray-400 text-center">
              <div>
                <p className="text-sm">Your resume preview will appear here</p>
                <p className="text-xs mt-1">Start filling in your details on the left</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
