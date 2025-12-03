import React from "react";
import { ResumeData, templateColors } from "@shared/schema";

interface BasicTemplateProps {
  resume: ResumeData;
  primaryColor: string; // Hex color from selected templateColors
}

export const BasicTemplate: React.FC<BasicTemplateProps> = ({ resume, primaryColor }) => {
  const { contactInfo, summary, experiences, education, skills, certifications } = resume;

  // Fallback for color if not found
  const accentColor = templateColors.find(c => c.hex === primaryColor) ? primaryColor : templateColors[0].hex;

  return (
    <div className="font-sans text-gray-800 p-6 sm:p-8 md:p-10 lg:p-12 leading-relaxed bg-white shadow-xl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 pb-4 border-b border-gray-300">
          <h1 className="text-4xl font-bold mb-1 text-gray-900">{contactInfo?.firstName} {contactInfo?.lastName}</h1>
          <div className="text-sm text-gray-600">
            {contactInfo?.address && <span>{contactInfo.address}{contactInfo.city && `, ${contactInfo.city}`}{contactInfo.zipCode && ` ${contactInfo.zipCode}`}</span>}
            {contactInfo?.phone && <span className="mx-2">|</span>}
            {contactInfo?.phone && <span>{contactInfo.phone}</span>}
            {contactInfo?.email && <span className="mx-2">|</span>}
            {contactInfo?.email && <span>{contactInfo.email}</span>}
            {contactInfo?.linkedin && <span className="mx-2">|</span>}
            {contactInfo?.linkedin && <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{contactInfo.linkedin.replace(/(https?:\/\/)?(www\.)?linkedin\.com\/in\//, 'linkedin.com/in/')}</a>}
            {contactInfo?.website && <span className="mx-2">|</span>}
            {contactInfo?.website && <a href={contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{contactInfo.website.replace(/(https?:\/\/)?(www\.)?/, '')}</a>}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="mb-8">
            <h2 className="text-lg font-bold uppercase mb-3" style={{ color: accentColor }}>Summary</h2>
            <p className="text-sm leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences && experiences.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold uppercase mb-4" style={{ color: accentColor }}>Experience</h2>
            {experiences.map((exp, index) => (
              <div key={exp.id || index} className="mb-5 last:mb-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-bold text-gray-900">{exp.jobTitle}</h3>
                  <span className="text-sm text-gray-600">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{exp.company} {exp.location && `| ${exp.location}`}</p>
                {exp.description && <p className="text-sm leading-relaxed mb-2">{exp.description}</p>}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {exp.bullets.map((bullet, i) => <li key={i}>{bullet}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold uppercase mb-4" style={{ color: accentColor }}>Education</h2>
            {education.map((edu, index) => (
              <div key={edu.id || index} className="mb-5 last:mb-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-bold text-gray-900">{edu.degree}</h3>
                  <span className="text-sm text-gray-600">{edu.graduationDate}</span>
                </div>
                <p className="text-sm text-gray-700">{edu.school} {edu.location && `| ${edu.location}`}</p>
                {edu.gpa && <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>}
                {edu.honors && <p className="text-xs text-gray-600">Honors: {edu.honors}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold uppercase mb-4" style={{ color: accentColor }}>Skills</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              {/* This assumes skills are grouped by category if needed, otherwise just lists them */}
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {skills.map((skill, index) => (
                  <li key={skill.id || index}>
                    <span className="font-semibold">{skill.name}</span>
                    {skill.level && <span className="ml-1 text-gray-600 capitalize">({skill.level})</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold uppercase mb-4" style={{ color: accentColor }}>Certifications</h2>
            {certifications.map((cert, index) => (
              <div key={cert.id || index} className="mb-3 last:mb-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-bold text-gray-900">{cert.name}</h3>
                  <span className="text-sm text-gray-600">{cert.date}</span>
                </div>
                <p className="text-sm text-gray-700">{cert.issuer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};