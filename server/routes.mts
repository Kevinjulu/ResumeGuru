import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.mts";
import { requireAuth } from "./auth.mts";
import { resumeDataSchema, templateColors, coverLetterDataSchema } from "@shared/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import downloadRouter from "./download.mts"; // Import the download router
import uploadRouter from "./upload.mts"; // Import the upload router

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)
    : null;

  // Delegate download routes to downloadRouter
  app.use('/api/download', downloadRouter);
  // Delegate upload routes to uploadRouter
  app.use('/api/upload', uploadRouter);
  
  // Generate AI summary
  app.post("/api/ai-suggestions", async (req, res) => {
    try {
      const { type, contactInfo, experiences, skills, jobTitle, description } = req.body; // Added type, jobTitle, description

      if (!genAI) {
        // Placeholder responses if no AI key
        if (type === "summary") {
            const name = contactInfo?.firstName ? `${contactInfo.firstName}` : "A professional";
            const currentJobTitle = experiences?.[0]?.jobTitle || "experienced professional";
            const topSkills = skills?.slice(0, 3).map((s: any) => s.name).join(", ") || "various skills";
            return res.json({
                suggestions: [`${name} is a dedicated ${currentJobTitle} with expertise in ${topSkills}. Proven track record of delivering results and contributing to team success. Seeking opportunities to leverage skills and experience in a dynamic environment.`]
            });
        } else if (type === "bullet_points") {
            return res.json({
                suggestions: [
                    "Developed and maintained scalable web applications.",
                    "Collaborated with cross-functional teams to deliver projects.",
                    "Implemented new features based on user feedback."
                ]
            });
        } else if (type === "skills") {
            return res.json({
                suggestions: ["Project Management", "Data Analysis", "Cloud Computing"]
            });
        }
        return res.status(400).json({ error: "Unsupported suggestion type and no AI key." });
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      let prompt = "";

      if (type === "summary") {
        const experienceList = experiences?.map((exp: any) => `${exp.jobTitle} at ${exp.company}`).join(", ") || "";
        const skillList = skills?.map((s: any) => s.name).join(", ") || "";
        prompt = `You are a professional resume writer. Generate a concise, impactful 2-3 sentence professional summary for a resume. Focus on key achievements, skills, and value proposition. Write in first person implied (no 'I' statements). Make it compelling and tailored to the person's background.\n\nName: ${contactInfo?.firstName || ""} ${contactInfo?.lastName || ""}\nExperience: ${experienceList || "Various professional roles"}\nSkills: ${skillList || "Various professional skills"}\n\nGenerate only the summary text, no quotes or additional formatting.`;
      } else if (type === "bullet_points") {
        prompt = `You are a professional resume writer. Generate 3-5 concise, impactful bullet points for a work experience entry. Focus on achievements, quantifiable results, and skills used. Use strong action verbs.
        \n\nJob Title: ${jobTitle}\nJob Description/Context: ${description}\n\nGenerate only the bullet points, one per line, no numbering or additional formatting.`;
      } else if (type === "skills") {
        prompt = `You are a professional resume writer. Based on the following job title and experience, suggest 5-7 relevant technical and soft skills. Provide only a comma-separated list of skills.
        \n\nJob Title: ${jobTitle}\nExperience Context: ${description}\n\nGenerate only the comma-separated list of skills, no additional formatting.`;
      } else {
        return res.status(400).json({ error: "Unsupported suggestion type." });
      }

      const response = await model.generateContent(prompt);
      const textResponse = response.response.text() || "";
      let suggestions: string[] = [];

      if (type === "summary") {
        suggestions = [textResponse];
      } else if (type === "bullet_points") {
        suggestions = textResponse.split('\n').map(s => s.trim()).filter(s => s.length > 0);
      } else if (type === "skills") {
        suggestions = textResponse.split(',').map(s => s.trim()).filter(s => s.length > 0);
      }
      
      res.json({ suggestions });
    } catch (error) {
      console.error(`Error generating ${type} suggestions:`, error);
      res.status(500).json({ error: `Failed to generate ${type} suggestions` });
    }
  }); // <-- ADDED THIS MISSING CLOSING BLOCK

  // Cover Letter Management Endpoints
  app.post("/api/coverletters", requireAuth, async (req, res) => {
    try {
      const { title, data, templateId, colorId } = req.body;
      const userId = (req.user as any)?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      // Validate with schema
      const parsedData = coverLetterDataSchema.parse(data);

      const coverLetter = await storage.createCoverLetter({
        title: title || "My Cover Letter",
        data: parsedData,
        templateId: templateId || "basic-cl",
        colorId: colorId || "orange",
        userId: userId,
      });

      res.json(coverLetter);
    } catch (error) {
      console.error("Error saving cover letter:", error);
      res.status(500).json({ error: "Failed to save cover letter" });
    }
  });

  app.get("/api/coverletters", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const coverLetters = await storage.getCoverLettersByUserId(userId);
      res.json(coverLetters);
    } catch (error) {
      console.error("Error listing cover letters:", error);
      res.status(500).json({ error: "Failed to list cover letters" });
    }
  });

  app.get("/api/coverletters/:id", requireAuth, async (req, res) => {
    try {
      const coverLetter = await storage.getCoverLetter(req.params.id);
      if (!coverLetter) {
        return res.status(404).json({ error: "Cover letter not found" });
      }
      // Ensure user owns the cover letter
      if (coverLetter.userId !== (req.user as any)?.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
      res.json(coverLetter);
    } catch (error) {
      console.error("Error fetching cover letter:", error);
      res.status(500).json({ error: "Failed to fetch cover letter" });
    }
  });

  app.patch("/api/coverletters/:id", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const existingCoverLetter = await storage.getCoverLetter(req.params.id);
      if (!existingCoverLetter) {
          return res.status(404).json({ error: "Cover letter not found" });
      }
      if (existingCoverLetter.userId !== userId) {
          return res.status(403).json({ error: "Forbidden" });
      }
      
      const coverLetter = await storage.updateCoverLetter(req.params.id, req.body);
      if (!coverLetter) {
        return res.status(404).json({ error: "Cover letter not found" });
      }
      res.json(coverLetter);
    } catch (error) {
      console.error("Error updating cover letter:", error);
      res.status(500).json({ error: "Failed to update cover letter" });
    }
  });

  app.delete("/api/coverletters/:id", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const existingCoverLetter = await storage.getCoverLetter(req.params.id);
      if (!existingCoverLetter) {
          return res.status(404).json({ error: "Cover letter not found" });
      }
      if (existingCoverLetter.userId !== userId) {
          return res.status(403).json({ error: "Forbidden" });
      }
      const success = await storage.deleteCoverLetter(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Cover letter not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting cover letter:", error);
      res.status(500).json({ error: "Failed to delete cover letter" });
    }
  });

  return httpServer;
}
