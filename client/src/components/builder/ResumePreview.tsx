import { useResume } from "@/lib/resumeContext";
import { templateColors } from "@shared/schema";
import { Mail, Phone, MapPin, Globe, Linkedin, Download, Eye } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function ResumePreview() {
  const { resumeData } = useResume();
  const { contactInfo, summary, experiences, education, skills, certifications, colorId } = resumeData;
  const [isHovered, setIsHovered] = useState(false);
  
  const currentColor = templateColors.find(c => c.id === colorId) || templateColors[0];

  const downloadPreview = () => {
    // Trigger a print dialog or download functionality
    window.print();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <div className="relative bg-white shadow-2xl rounded-2xl overflow-hidden hover:shadow-3xl transition-all duration-300" style={{ aspectRatio: "8.5/11" }}>
        {/* Enhanced Preview Container */}
        <div className="h-full flex flex-col text-[10px] leading-tight bg-gradient-to-b from-white to-gray-50">
          {/* Header Section */}
          <div 
            className="p-5 text-white relative overflow-hidden"
            style={{ backgroundColor: currentColor.hex }}
          >
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 opacity-10" style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 100%)`
            }}></div>
            
            <div className="relative z-10">
              <h1 className="text-xl font-bold tracking-tight">
                {contactInfo?.firstName || "Your"} {contactInfo?.lastName || "Name"}
              </h1>
              
              <div className="flex flex-wrap gap-3 mt-2.5 text-white/95">
                {contactInfo?.email && (
                  <div className="flex items-center gap-1 hover:text-white transition-colors">
                    <Mail className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{contactInfo.email}</span>
                  </div>
                )}
                {contactInfo?.phone && (
                  <div className="flex items-center gap-1 hover:text-white transition-colors">
                    <Phone className="w-3 h-3 flex-shrink-0" />
                    <span>{contactInfo.phone}</span>
                  </div>
                )}
                {(contactInfo?.city || contactInfo?.state) && (
                  <div className="flex items-center gap-1 hover:text-white transition-colors">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span>
                      {[contactInfo.city, contactInfo.state].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
                {contactInfo?.linkedin && (
                  <div className="flex items-center gap-1 hover:text-white transition-colors">
                    <Linkedin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{contactInfo.linkedin}</span>
                  </div>
                )}
                {contactInfo?.website && (
                  <div className="flex items-center gap-1 hover:text-white transition-colors">
                    <Globe className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{contactInfo.website}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        <div className="flex-1 p-5 space-y-3 overflow-y-auto">
          {/* Professional Summary Section */}
          {summary && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="group/section"
            >
              <h2 
                className="text-xs font-bold uppercase tracking-widest mb-1.5 pb-1 border-b-2 transition-colors"
                style={{ color: currentColor.hex, borderColor: currentColor.hex }}
              >
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-tight">{summary}</p>
            </motion.section>
          )}

          {/* Work Experience Section */}
          {experiences.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 
                className="text-xs font-bold uppercase tracking-widest mb-1.5 pb-1 border-b-2"
                style={{ color: currentColor.hex, borderColor: currentColor.hex }}
              >
                Work Experience
              </h2>
              <div className="space-y-2.5">
                {experiences.map((exp) => (
                  <div key={exp.id} className="hover:bg-gray-50 p-1 rounded transition-colors">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                        <p className="text-gray-600 text-[9px]">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                      </div>
                      <span className="text-gray-500 text-[8px] flex-shrink-0 whitespace-nowrap">
                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    {exp.bullets.length > 0 && (
                      <ul className="mt-1 space-y-0.5 ml-2">
                        {exp.bullets.map((bullet, i) => (
                          <li key={i} className="text-gray-700 text-[9px] relative pl-2 before:absolute before:left-0 before:top-[0.35em] before:w-1 before:h-1 before:rounded-full before:bg-gray-400">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Education Section */}
          {education.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 
                className="text-xs font-bold uppercase tracking-widest mb-1.5 pb-1 border-b-2"
                style={{ color: currentColor.hex, borderColor: currentColor.hex }}
              >
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="hover:bg-gray-50 p-1 rounded transition-colors">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                        <p className="text-gray-600 text-[9px]">{edu.school}{edu.location ? `, ${edu.location}` : ""}</p>
                      </div>
                      {edu.graduationDate && (
                        <span className="text-gray-500 text-[8px] flex-shrink-0 whitespace-nowrap">{edu.graduationDate}</span>
                      )}
                    </div>
                    {edu.gpa && <p className="text-gray-600 text-[9px]">GPA: {edu.gpa}</p>}
                    {edu.honors && <p className="text-gray-600 text-[9px]">{edu.honors}</p>}
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Skills Section */}
          {skills.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 
                className="text-xs font-bold uppercase tracking-widest mb-1.5 pb-1 border-b-2"
                style={{ color: currentColor.hex, borderColor: currentColor.hex }}
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-2 py-0.5 rounded-full text-[8px] font-medium hover:shadow-sm transition-shadow"
                    style={{ backgroundColor: `${currentColor.hex}20`, color: currentColor.hex, border: `0.5px solid ${currentColor.hex}40` }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </motion.section>
          )}

          {/* Certifications Section */}
          {certifications.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 
                className="text-xs font-bold uppercase tracking-widest mb-1.5 pb-1 border-b-2"
                style={{ color: currentColor.hex, borderColor: currentColor.hex }}
              >
                Certifications
              </h2>
              <div className="space-y-1">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex justify-between items-start gap-2 hover:bg-gray-50 p-1 rounded transition-colors">
                    <div>
                      <span className="font-semibold text-gray-900">{cert.name}</span>
                      {cert.issuer && <span className="text-gray-600 text-[9px]"> - {cert.issuer}</span>}
                    </div>
                    {cert.date && <span className="text-gray-500 text-[8px] flex-shrink-0 whitespace-nowrap">{cert.date}</span>}
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Empty State */}
          {!summary && experiences.length === 0 && education.length === 0 && skills.length === 0 && (
            <div className="h-full flex items-center justify-center text-gray-400 text-center">
              <div>
                <Eye className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-medium">Your resume preview will appear here</p>
                <p className="text-[8px] mt-1 opacity-75">Start filling in your details on the left</p>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Hover Overlay with Download Button */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center backdrop-blur-sm z-10 pointer-events-none"
        >
          <motion.button
            onClick={downloadPreview}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 shadow-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
