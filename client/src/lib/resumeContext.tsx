import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { ResumeData, Experience, Education, Skill, Certification, ContactInfo } from "@shared/schema";

interface ResumeContextType {
  resumeData: ResumeData;
  updateContactInfo: (info: Partial<ContactInfo>) => void;
  updateSummary: (summary: string) => void;
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: Skill) => void;
  removeSkill: (id: string) => void;
  addCertification: (cert: Certification) => void;
  updateCertification: (id: string, cert: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  setTemplate: (templateId: string) => void;
  setColor: (colorId: string) => void;
  resetResume: () => void;
  loadResume: (data: ResumeData) => void;
}

const defaultResumeData: ResumeData = {
  contactInfo: {},
  summary: "",
  experiences: [],
  education: [],
  skills: [],
  certifications: [],
  templateId: "clean",
  colorId: "orange",
};

const ResumeContext = createContext<ResumeContextType | null>(null);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem("resumeData");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultResumeData;
      }
    }
    return defaultResumeData;
  });

  const saveToStorage = useCallback((data: ResumeData) => {
    localStorage.setItem("resumeData", JSON.stringify(data));
  }, []);

  const updateContactInfo = useCallback((info: Partial<ContactInfo>) => {
    setResumeData((prev) => {
      const updated = {
        ...prev,
        contactInfo: { ...prev.contactInfo, ...info },
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const updateSummary = useCallback((summary: string) => {
    setResumeData((prev) => {
      const updated = { ...prev, summary };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const addExperience = useCallback((exp: Experience) => {
    setResumeData((prev) => {
      const updated = {
        ...prev,
        experiences: [...prev.experiences, exp],
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const updateExperience = useCallback((id: string, exp: Partial<Experience>) => {
    setResumeData((prev) => {
      const updated = {
        ...prev,
        experiences: prev.experiences.map((e) =>
          e.id === id ? { ...e, ...exp } : e
        ),
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const removeExperience = useCallback((id: string) => {
    setResumeData((prev) => {
      const updated = {
        ...prev,
        experiences: prev.experiences.filter((e) => e.id !== id),
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const addEducation = useCallback((edu: Education) => {
    setResumeData((prev) => {
      const updated = {
        ...prev,
        education: [...prev.education, edu],
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const updateEducation = useCallback((id: string, edu: Partial<Education>) => {
    setResumeData((prev) => {
      const updated = {
        ...prev,
        education: prev.education.map((e) =>
          e.id === id ? { ...e, ...edu } : e
        ),
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const removeEducation = useCallback((id: string) => {
    setResumeData((prev) => {
      const updated = {
        ...prev,
        education: prev.education.filter((e) => e.id !== id),
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const addSkill = useCallback((skill: Skill) => {
    setResumeData((prev) => {
      const updated = {
        ...prev,
        skills: [...prev.skills, skill],
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const removeSkill = useCallback((id: string) => {
    setResumeData((prev) => {
      const updated = {
        ...prev,
        skills: prev.skills.filter((s) => s.id !== id),
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const addCertification = useCallback((cert: Certification) => {
    setResumeData((prev) => {
      const updated = {
        ...prev,
        certifications: [...prev.certifications, cert],
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const updateCertification = useCallback((id: string, cert: Partial<Certification>) => {
    setResumeData((prev) => {
      const updated = {
        ...prev,
        certifications: prev.certifications.map((c) =>
          c.id === id ? { ...c, ...cert } : c
        ),
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const removeCertification = useCallback((id: string) => {
    setResumeData((prev) => {
      const updated = {
        ...prev,
        certifications: prev.certifications.filter((c) => c.id !== id),
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const setTemplate = useCallback((templateId: string) => {
    setResumeData((prev) => {
      const updated = { ...prev, templateId };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const setColor = useCallback((colorId: string) => {
    setResumeData((prev) => {
      const updated = { ...prev, colorId };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const resetResume = useCallback(() => {
    setResumeData(defaultResumeData);
    localStorage.removeItem("resumeData");
  }, []);

  const loadResume = useCallback((data: ResumeData) => {
    setResumeData(data);
    saveToStorage(data);
  }, [saveToStorage]);

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        updateContactInfo,
        updateSummary,
        addExperience,
        updateExperience,
        removeExperience,
        addEducation,
        updateEducation,
        removeEducation,
        addSkill,
        removeSkill,
        addCertification,
        updateCertification,
        removeCertification,
        setTemplate,
        setColor,
        resetResume,
        loadResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}
