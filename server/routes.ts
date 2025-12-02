import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { resumeDataSchema, templateColors } from "@shared/schema";
import OpenAI from "openai";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Initialize OpenAI client (if API key is available)
  const openai = process.env.OPENAI_API_KEY 
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

  // Generate AI summary
  app.post("/api/generate-summary", async (req, res) => {
    try {
      const { contactInfo, experiences, skills } = req.body;

      if (!openai) {
        // Return a placeholder summary if no OpenAI key
        const name = contactInfo?.firstName ? `${contactInfo.firstName}` : "A professional";
        const jobTitle = experiences?.[0]?.jobTitle || "experienced professional";
        const topSkills = skills?.slice(0, 3).map((s: any) => s.name).join(", ") || "various skills";
        
        return res.json({
          summary: `${name} is a dedicated ${jobTitle} with expertise in ${topSkills}. Proven track record of delivering results and contributing to team success. Seeking opportunities to leverage skills and experience in a dynamic environment.`
        });
      }

      // Build context for AI
      const experienceList = experiences?.map((exp: any) => 
        `${exp.jobTitle} at ${exp.company}`
      ).join(", ") || "";
      
      const skillList = skills?.map((s: any) => s.name).join(", ") || "";

      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: "You are a professional resume writer. Generate a concise, impactful 2-3 sentence professional summary for a resume. Focus on key achievements, skills, and value proposition. Write in first person implied (no 'I' statements). Make it compelling and tailored to the person's background."
          },
          {
            role: "user",
            content: `Write a professional summary for someone with the following background:
            Name: ${contactInfo?.firstName || ""} ${contactInfo?.lastName || ""}
            Experience: ${experienceList || "Various professional roles"}
            Skills: ${skillList || "Various professional skills"}
            
            Generate only the summary text, no quotes or additional formatting.`
          }
        ],
        max_completion_tokens: 200,
      });

      const summary = response.choices[0]?.message?.content || "";
      res.json({ summary });
    } catch (error) {
      console.error("Error generating summary:", error);
      res.status(500).json({ error: "Failed to generate summary" });
    }
  });

  // Download resume as PDF (returns HTML that can be printed as PDF)
  app.post("/api/download/pdf", async (req, res) => {
    try {
      const result = resumeDataSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid resume data" });
      }

      const resumeData = result.data;
      const { contactInfo, colorId } = resumeData;
      const currentColor = templateColors.find(c => c.id === colorId) || templateColors[0];

      const htmlContent = generateResumeHTML(resumeData, currentColor.hex);
      const filename = `${contactInfo?.firstName || "Resume"}_${contactInfo?.lastName || ""}_Resume.html`;
      
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(htmlContent);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  });

  // Download resume as DOCX (returns RTF-compatible text)
  app.post("/api/download/docx", async (req, res) => {
    try {
      const result = resumeDataSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid resume data" });
      }

      const resumeData = result.data;
      const { contactInfo } = resumeData;

      const textContent = generateResumePlainText(resumeData);
      const filename = `${contactInfo?.firstName || "Resume"}_${contactInfo?.lastName || ""}_Resume.txt`;
      
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(textContent);
    } catch (error) {
      console.error("Error generating DOCX:", error);
      res.status(500).json({ error: "Failed to generate DOCX" });
    }
  });

  // Download resume as TXT
  app.post("/api/download/txt", async (req, res) => {
    try {
      const result = resumeDataSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid resume data" });
      }

      const resumeData = result.data;
      const { contactInfo } = resumeData;

      const textContent = generateResumePlainText(resumeData);
      
      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Content-Disposition", `attachment; filename="${contactInfo?.firstName || "Resume"}_${contactInfo?.lastName || ""}_Resume.txt"`);
      res.send(textContent);
    } catch (error) {
      console.error("Error generating TXT:", error);
      res.status(500).json({ error: "Failed to generate TXT" });
    }
  });

  // Save resume
  app.post("/api/resumes", async (req, res) => {
    try {
      const { title, data, templateId, colorId, userId } = req.body;
      
      const resume = await storage.createResume({
        title: title || "My Resume",
        data,
        templateId: templateId || "clean",
        colorId: colorId || "orange",
        userId: userId || null,
      });

      res.json(resume);
    } catch (error) {
      console.error("Error saving resume:", error);
      res.status(500).json({ error: "Failed to save resume" });
    }
  });

  // Get resume by ID
  app.get("/api/resumes/:id", async (req, res) => {
    try {
      const resume = await storage.getResume(req.params.id);
      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }
      res.json(resume);
    } catch (error) {
      console.error("Error fetching resume:", error);
      res.status(500).json({ error: "Failed to fetch resume" });
    }
  });

  // Update resume
  app.patch("/api/resumes/:id", async (req, res) => {
    try {
      const resume = await storage.updateResume(req.params.id, req.body);
      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }
      res.json(resume);
    } catch (error) {
      console.error("Error updating resume:", error);
      res.status(500).json({ error: "Failed to update resume" });
    }
  });

  // Delete resume
  app.delete("/api/resumes/:id", async (req, res) => {
    try {
      const success = await storage.deleteResume(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Resume not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting resume:", error);
      res.status(500).json({ error: "Failed to delete resume" });
    }
  });

  return httpServer;
}

function generateResumeHTML(resumeData: any, colorHex: string): string {
  const { contactInfo, summary, experiences, education, skills, certifications } = resumeData;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${contactInfo?.firstName || ""} ${contactInfo?.lastName || ""} - Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.4; color: #333; max-width: 8.5in; margin: 0 auto; padding: 0.5in; }
    .header { background: ${colorHex}; color: white; padding: 20px; margin: -0.5in -0.5in 20px -0.5in; }
    .header h1 { font-size: 24pt; margin-bottom: 8px; }
    .header .contact { display: flex; flex-wrap: wrap; gap: 16px; font-size: 10pt; }
    .section { margin-bottom: 16px; }
    .section-title { color: ${colorHex}; font-size: 12pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid ${colorHex}; padding-bottom: 4px; margin-bottom: 8px; }
    .entry { margin-bottom: 12px; }
    .entry-header { display: flex; justify-content: space-between; }
    .entry-title { font-weight: bold; }
    .entry-subtitle { color: #666; }
    .entry-date { color: #888; font-size: 10pt; }
    .bullets { margin-left: 20px; margin-top: 4px; }
    .bullets li { margin-bottom: 2px; }
    .skills { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill { background: ${colorHex}15; color: ${colorHex}; padding: 4px 8px; border-radius: 4px; font-size: 10pt; }
    @media print { body { padding: 0; } .header { margin: 0 0 20px 0; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>${contactInfo?.firstName || "Your"} ${contactInfo?.lastName || "Name"}</h1>
    <div class="contact">
      ${contactInfo?.email ? `<span>${contactInfo.email}</span>` : ""}
      ${contactInfo?.phone ? `<span>${contactInfo.phone}</span>` : ""}
      ${contactInfo?.city || contactInfo?.state ? `<span>${[contactInfo.city, contactInfo.state].filter(Boolean).join(", ")}</span>` : ""}
      ${contactInfo?.linkedin ? `<span>${contactInfo.linkedin}</span>` : ""}
    </div>
  </div>

  ${summary ? `
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <p>${summary}</p>
  </div>
  ` : ""}

  ${experiences?.length ? `
  <div class="section">
    <div class="section-title">Work Experience</div>
    ${experiences.map((exp: any) => `
    <div class="entry">
      <div class="entry-header">
        <div>
          <div class="entry-title">${exp.jobTitle}</div>
          <div class="entry-subtitle">${exp.company}${exp.location ? `, ${exp.location}` : ""}</div>
        </div>
        <div class="entry-date">${exp.startDate} - ${exp.current ? "Present" : exp.endDate || ""}</div>
      </div>
      ${exp.bullets?.length ? `
      <ul class="bullets">
        ${exp.bullets.map((b: string) => `<li>${b}</li>`).join("")}
      </ul>
      ` : ""}
    </div>
    `).join("")}
  </div>
  ` : ""}

  ${education?.length ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${education.map((edu: any) => `
    <div class="entry">
      <div class="entry-header">
        <div>
          <div class="entry-title">${edu.degree}</div>
          <div class="entry-subtitle">${edu.school}${edu.location ? `, ${edu.location}` : ""}</div>
        </div>
        ${edu.graduationDate ? `<div class="entry-date">${edu.graduationDate}</div>` : ""}
      </div>
      ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ""}
      ${edu.honors ? `<div>${edu.honors}</div>` : ""}
    </div>
    `).join("")}
  </div>
  ` : ""}

  ${skills?.length ? `
  <div class="section">
    <div class="section-title">Skills</div>
    <div class="skills">
      ${skills.map((s: any) => `<span class="skill">${s.name}</span>`).join("")}
    </div>
  </div>
  ` : ""}

  ${certifications?.length ? `
  <div class="section">
    <div class="section-title">Certifications</div>
    ${certifications.map((cert: any) => `
    <div class="entry">
      <div class="entry-header">
        <div>
          <div class="entry-title">${cert.name}</div>
          ${cert.issuer ? `<div class="entry-subtitle">${cert.issuer}</div>` : ""}
        </div>
        ${cert.date ? `<div class="entry-date">${cert.date}</div>` : ""}
      </div>
    </div>
    `).join("")}
  </div>
  ` : ""}
</body>
</html>
  `.trim();
}

function generateResumePlainText(resumeData: any): string {
  const { contactInfo, summary, experiences, education, skills, certifications } = resumeData;

  let text = "";

  // Header
  text += `${contactInfo?.firstName || "Your"} ${contactInfo?.lastName || "Name"}\n`;
  text += "=".repeat(50) + "\n";
  if (contactInfo?.email) text += `Email: ${contactInfo.email}\n`;
  if (contactInfo?.phone) text += `Phone: ${contactInfo.phone}\n`;
  if (contactInfo?.city || contactInfo?.state) {
    text += `Location: ${[contactInfo.city, contactInfo.state].filter(Boolean).join(", ")}\n`;
  }
  if (contactInfo?.linkedin) text += `LinkedIn: ${contactInfo.linkedin}\n`;
  text += "\n";

  // Summary
  if (summary) {
    text += "PROFESSIONAL SUMMARY\n";
    text += "-".repeat(30) + "\n";
    text += summary + "\n\n";
  }

  // Experience
  if (experiences?.length) {
    text += "WORK EXPERIENCE\n";
    text += "-".repeat(30) + "\n";
    for (const exp of experiences) {
      text += `${exp.jobTitle} | ${exp.company}${exp.location ? ` | ${exp.location}` : ""}\n`;
      text += `${exp.startDate} - ${exp.current ? "Present" : exp.endDate || ""}\n`;
      if (exp.bullets?.length) {
        for (const bullet of exp.bullets) {
          text += `  • ${bullet}\n`;
        }
      }
      text += "\n";
    }
  }

  // Education
  if (education?.length) {
    text += "EDUCATION\n";
    text += "-".repeat(30) + "\n";
    for (const edu of education) {
      text += `${edu.degree} | ${edu.school}${edu.location ? ` | ${edu.location}` : ""}\n`;
      if (edu.graduationDate) text += `Graduated: ${edu.graduationDate}\n`;
      if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
      if (edu.honors) text += `Honors: ${edu.honors}\n`;
      text += "\n";
    }
  }

  // Skills
  if (skills?.length) {
    text += "SKILLS\n";
    text += "-".repeat(30) + "\n";
    text += skills.map((s: any) => s.name).join(", ") + "\n\n";
  }

  // Certifications
  if (certifications?.length) {
    text += "CERTIFICATIONS\n";
    text += "-".repeat(30) + "\n";
    for (const cert of certifications) {
      text += `${cert.name}`;
      if (cert.issuer) text += ` | ${cert.issuer}`;
      if (cert.date) text += ` | ${cert.date}`;
      text += "\n";
    }
  }

  return text;
}
