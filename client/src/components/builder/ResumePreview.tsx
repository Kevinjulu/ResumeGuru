import { useResume } from "@/lib/resumeContext";
import { templateColors, templateTypography } from "@shared/schema";
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

export function ResumePreview() {
  const { resumeData } = useResume();
  const { contactInfo, summary, experiences, education, skills, certifications, colorId, templateId } = resumeData;
  
  const currentColor = templateColors.find(c => c.id === colorId) || templateColors[0];
  const styleScale = {
    base: 10,
    header: templateId === 'neo' ? 20 : 18,
    section: templateId === 'neo' ? 13 : 12,
  };
  const fonts = templateTypography[templateId as keyof typeof templateTypography] || { headerFamily: 'Inter', bodyFamily: 'Inter', headerWeight: 700, bodyWeight: 400 };

  const Header = () => (
    <div className="text-white" style={{ backgroundColor: currentColor.hex, padding: styleScale.base * 0.4, fontFamily: fonts.headerFamily, fontWeight: fonts.headerWeight }}>
      <h1 className="font-bold" style={{ fontSize: styleScale.header }}>
        {contactInfo?.firstName || "Your"} {contactInfo?.lastName || "Name"}
      </h1>
      <div className="flex flex-wrap gap-3 mt-2 text-white/90">
        {contactInfo?.email && (
          <div className="flex items-center gap-1"><Mail className="w-3 h-3" /><span>{contactInfo.email}</span></div>
        )}
        {contactInfo?.phone && (
          <div className="flex items-center gap-1"><Phone className="w-3 h-3" /><span>{contactInfo.phone}</span></div>
        )}
        {(contactInfo?.city || contactInfo?.state) && (
          <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /><span>{[contactInfo.city, contactInfo.state].filter(Boolean).join(", ")}</span></div>
        )}
        {contactInfo?.linkedin && (
          <div className="flex items-center gap-1"><Linkedin className="w-3 h-3" /><span>{contactInfo.linkedin}</span></div>
        )}
        {contactInfo?.website && (
          <div className="flex items-center gap-1"><Globe className="w-3 h-3" /><span>{contactInfo.website}</span></div>
        )}
      </div>
    </div>
  );

  const Sections = () => {
    const order = resumeData.sectionOrder || ["summary","experience","education","skills","certifications"];
    const renderers: Record<string, JSX.Element | null> = {
      summary: summary ? (
        <section>
          <h2 className="font-bold uppercase tracking-wide mb-1 pb-0.5 border-b" style={{ color: currentColor.hex, borderColor: currentColor.hex, fontSize: styleScale.section }}>Professional Summary</h2>
          <p className="text-gray-700">{summary}</p>
        </section>
      ) : null,
      experience: experiences.length > 0 ? (
        <section>
          <h2 className="font-bold uppercase tracking-wide mb-1 pb-0.5 border-b" style={{ color: currentColor.hex, borderColor: currentColor.hex, fontSize: styleScale.section }}>Work Experience</h2>
          <div className="space-y-2">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                    <p className="text-gray-600">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                  </div>
                  <span className="text-gray-500 text-[9px]">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                </div>
                {exp.bullets.length > 0 && (
                  <ul className="mt-1 space-y-0.5 ml-3">
                    {exp.bullets.map((bullet, i) => (
                      <li key={i} className="text-gray-700 relative pl-2 before:absolute before:left-0 before:top-[0.4em] before:w-1 before:h-1 before:rounded-full before:bg-gray-400">{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null,
      education: education.length > 0 ? (
        <section>
          <h2 className="font-bold uppercase tracking-wide mb-1 pb-0.5 border-b" style={{ color: currentColor.hex, borderColor: currentColor.hex, fontSize: styleScale.section }}>Education</h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.school}{edu.location ? `, ${edu.location}` : ""}</p>
                  </div>
                  {edu.graduationDate && (<span className="text-gray-500 text-[9px]">{edu.graduationDate}</span>)}
                </div>
                {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                {edu.honors && <p className="text-gray-600">{edu.honors}</p>}
              </div>
            ))}
          </div>
        </section>
      ) : null,
      skills: skills.length > 0 ? (
        <section>
          <h2 className="font-bold uppercase tracking-wide mb-1 pb-0.5 border-b" style={{ color: currentColor.hex, borderColor: currentColor.hex, fontSize: styleScale.section }}>Skills</h2>
          <div className="flex flex-wrap gap-1">
            {skills.map((skill) => (
              <span key={skill.id} className="px-1.5 py-0.5 rounded text-[9px]" style={{ backgroundColor: `${currentColor.hex}15`, color: currentColor.hex }}>{skill.name}</span>
            ))}
          </div>
        </section>
      ) : null,
      certifications: certifications.length > 0 ? (
        <section>
          <h2 className="font-bold uppercase tracking-wide mb-1 pb-0.5 border-b" style={{ color: currentColor.hex, borderColor: currentColor.hex, fontSize: styleScale.section }}>Certifications</h2>
          <div className="space-y-1">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between">
                <div><span className="font-medium text-gray-900">{cert.name}</span>{cert.issuer && <span className="text-gray-600"> - {cert.issuer}</span>}</div>
                {cert.date && <span className="text-gray-500 text-[9px]">{cert.date}</span>}
              </div>
            ))}
          </div>
        </section>
      ) : null,
    };
    const content = order.map((key) => renderers[key]).filter(Boolean);
    return (
      <div className="flex-1 overflow-y-auto" style={{ padding: styleScale.base * 0.4, fontFamily: fonts.bodyFamily, fontWeight: fonts.bodyWeight }}>
        {content.length > 0 ? content : (
          <div className="h-full flex items-center justify-center text-gray-400 text-center"><div><p className="text-sm">Your resume preview will appear here</p><p className="text-xs mt-1">Start filling in your details on the left</p></div></div>
        )}
      </div>
    );
  };

  const variant = templateId === 'compact' || templateId === 'sidebar-pro' ? resumeData.layoutVariant ?? 'double' : undefined;

  if (templateId === "sidebar-pro" && variant === 'double') {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden" style={{ aspectRatio: "8.5/11" }}>
        <div className="h-full grid grid-cols-[28%_72%] text-[10px] leading-tight">
          <div className="p-4 text-white" style={{ backgroundColor: currentColor.hex }}>
            <h1 className="text-lg font-bold">{contactInfo?.firstName || "Your"} {contactInfo?.lastName || "Name"}</h1>
            <div className="mt-3 space-y-1">
              {contactInfo?.email && (<div className="flex items-center gap-1"><Mail className="w-3 h-3" /><span>{contactInfo.email}</span></div>)}
              {contactInfo?.phone && (<div className="flex items-center gap-1"><Phone className="w-3 h-3" /><span>{contactInfo.phone}</span></div>)}
              {(contactInfo?.city || contactInfo?.state) && (<div className="flex items-center gap-1"><MapPin className="w-3 h-3" /><span>{[contactInfo.city, contactInfo.state].filter(Boolean).join(", ")}</span></div>)}
              {contactInfo?.linkedin && (<div className="flex items-center gap-1"><Linkedin className="w-3 h-3" /><span>{contactInfo.linkedin}</span></div>)}
              {contactInfo?.website && (<div className="flex items-center gap-1"><Globe className="w-3 h-3" /><span>{contactInfo.website}</span></div>)}
            </div>
            {skills.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xs font-bold uppercase tracking-wide mb-1">Skills</h2>
                <div className="flex flex-wrap gap-1">
                  {skills.map((s) => (<span key={s.id} className="px-1.5 py-0.5 rounded text-[9px] bg-white/20">{s.name}</span>))}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <Sections />
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "neo") {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden" style={{ aspectRatio: "8.5/11" }}>
        <div className="h-full flex flex-col text-[10px] leading-tight">
          <Header />
          <Sections />
        </div>
      </div>
    );
  }

  if (templateId === "timeline") {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden" style={{ aspectRatio: "8.5/11" }}>
        <div className="h-full flex flex-col text-[10px] leading-tight">
          <Header />
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {summary && (<section><h2 className="text-xs font-bold uppercase tracking-wide mb-1 pb-0.5 border-b" style={{ color: currentColor.hex, borderColor: currentColor.hex }}>Professional Summary</h2><p className="text-gray-700">{summary}</p></section>)}
            {experiences.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: currentColor.hex }}>Work Experience</h2>
                <div className="relative pl-4">
                  <div className="absolute left-0 top-0 bottom-0 w-px" style={{ backgroundColor: currentColor.hex }} />
                  <div className="space-y-3">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="relative">
                        <div className="absolute -left-2 top-1 w-3 h-3 rounded-full" style={{ backgroundColor: currentColor.hex }} />
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                            <p className="text-gray-600">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                          </div>
                          <span className="text-gray-500 text-[9px]">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                        </div>
                        {exp.bullets.length > 0 && (
                          <ul className="mt-1 space-y-0.5 ml-3">
                            {exp.bullets.map((bullet, i) => (<li key={i} className="text-gray-700 relative pl-2 before:absolute before:left-0 before:top-[0.4em] before:w-1 before:h-1 before:rounded-full before:bg-gray-400">{bullet}</li>))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
            {education.length > 0 && (<section><h2 className="text-xs font-bold uppercase tracking-wide mb-1 pb-0.5 border-b" style={{ color: currentColor.hex, borderColor: currentColor.hex }}>Education</h2><div className="space-y-2">{education.map((edu) => (<div key={edu.id} className="flex justify-between"><div><h3 className="font-semibold text-gray-900">{edu.degree}</h3><p className="text-gray-600">{edu.school}{edu.location ? `, ${edu.location}` : ""}</p></div>{edu.graduationDate && (<span className="text-gray-500 text-[9px]">{edu.graduationDate}</span>)}</div>))}</div></section>)}
            {skills.length > 0 && (<section><h2 className="text-xs font-bold uppercase tracking-wide mb-1 pb-0.5 border-b" style={{ color: currentColor.hex, borderColor: currentColor.hex }}>Skills</h2><div className="flex flex-wrap gap-1">{skills.map((skill) => (<span key={skill.id} className="px-1.5 py-0.5 rounded text-[9px]" style={{ backgroundColor: `${currentColor.hex}15`, color: currentColor.hex }}>{skill.name}</span>))}</div></section>)}
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "compact" && variant === 'double') {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden" style={{ aspectRatio: "8.5/11" }}>
        <div className="h-full grid grid-cols-2 gap-2 text-[10px] leading-tight">
          <div className="col-span-2"><Header /></div>
          <div className="p-3 space-y-2 overflow-y-auto">
            {summary && (<section><h2 className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: currentColor.hex }}>Summary</h2><p className="text-gray-700">{summary}</p></section>)}
            {experiences.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: currentColor.hex }}>Experience</h2>
                <div className="space-y-2">{experiences.map((exp) => (<div key={exp.id}><div className="flex justify-between items-start"><div><h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3><p className="text-gray-600">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p></div><span className="text-gray-500 text-[9px]">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span></div>{exp.bullets.length > 0 && (<ul className="mt-1 space-y-0.5 ml-3">{exp.bullets.map((b, i) => (<li key={i} className="text-gray-700 relative pl-2 before:absolute before:left-0 before:top-[0.4em] before:w-1 before:h-1 before:rounded-full before:bg-gray-400">{b}</li>))}</ul>)}</div>))}</div>
              </section>
            )}
          </div>
          <div className="p-3 space-y-2 overflow-y-auto">
            {education.length > 0 && (<section><h2 className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: currentColor.hex }}>Education</h2><div className="space-y-2">{education.map((edu) => (<div key={edu.id} className="flex justify-between items-start"><div><h3 className="font-semibold text-gray-900">{edu.degree}</h3><p className="text-gray-600">{edu.school}{edu.location ? `, ${edu.location}` : ""}</p></div>{edu.graduationDate && (<span className="text-gray-500 text-[9px]">{edu.graduationDate}</span>)}</div>))}</div></section>)}
            {skills.length > 0 && (<section><h2 className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: currentColor.hex }}>Skills</h2><div className="flex flex-wrap gap-1">{skills.map((skill) => (<span key={skill.id} className="px-1.5 py-0.5 rounded text-[9px]" style={{ backgroundColor: `${currentColor.hex}15`, color: currentColor.hex }}>{skill.name}</span>))}</div></section>)}
            {certifications.length > 0 && (<section><h2 className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: currentColor.hex }}>Certifications</h2><div className="space-y-1">{certifications.map((cert) => (<div key={cert.id} className="flex justify-between"><div><span className="font-medium text-gray-900">{cert.name}</span>{cert.issuer && <span className="text-gray-600"> - {cert.issuer}</span>}</div>{cert.date && <span className="text-gray-500 text-[9px]">{cert.date}</span>}</div>))}</div></section>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden" style={{ aspectRatio: "8.5/11" }}>
      <div className="h-full flex flex-col text-[10px] leading-tight">
        <Header />
        <Sections />
      </div>
    </div>
  );
}
