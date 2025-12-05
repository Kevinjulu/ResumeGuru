import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.mts";
import { requireClerkAuth, clerkMiddleware } from "./middleware/clerk";
import { requireFeature } from "./middleware/featureGate.mts";
import { resumeDataSchema, templateColors, coverLetterDataSchema } from "@shared/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import downloadRouter from "./download.mts"; // Import the download router
import uploadRouter from "./upload.mts"; // Import the upload router
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for avatar uploads
const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads', 'avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});



export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  console.log("Registering routes... (v3)");
  // Temporary migration route - BEFORE middleware
  app.get('/api/migrate-password-v2', async (req, res) => {
    try {
      const { drizzle } = await import("drizzle-orm/neon-http");
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL!);
      await sql`ALTER TABLE users ALTER COLUMN password DROP NOT NULL`;
      res.json({ success: true });
    } catch (error: any) {
      console.error("Migration failed:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // app.use(clerkMiddleware); // Temporarily disabled for migration

  const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)
    : null;

  // Delegate download routes to downloadRouter
  app.use('/api/download', downloadRouter);
  // Delegate upload routes to uploadRouter


  app.use('/api/upload', uploadRouter);

  // Avatar Upload Endpoint
  app.post('/api/user/avatar', requireClerkAuth, uploadAvatar.single('avatar'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const userId = (req.user as any).id;
      const avatarUrl = `/uploads/avatars/${req.file.filename}`;

      // Update user in database
      await storage.updateUser(userId, { avatarUrl });

      res.json({ avatarUrl });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      res.status(500).json({ error: 'Failed to upload avatar' });
    }
  });

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

  // Generate AI Summary - Feature Gated (Pro+ only)
  app.post("/api/generate-summary", requireClerkAuth, requireFeature('aiFeatures'), async (req, res) => {
    try {
      const { contactInfo, experiences, skills } = req.body;

      if (!genAI) {
        // Placeholder response if no AI key
        const name = contactInfo?.firstName ? `${contactInfo.firstName}` : "A professional";
        const currentJobTitle = experiences?.[0]?.jobTitle || "experienced professional";
        const topSkills = skills?.slice(0, 3).map((s: any) => s.name).join(", ") || "various skills";
        return res.json({
          summary: `${name} is a dedicated ${currentJobTitle} with expertise in ${topSkills}. Proven track record of delivering results and contributing to team success. Seeking opportunities to leverage skills and experience in a dynamic environment.`
        });
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const experienceList = experiences?.map((exp: any) => `${exp.jobTitle} at ${exp.company}`).join(", ") || "";
      const skillList = skills?.map((s: any) => s.name).join(", ") || "";

      const prompt = `You are a professional resume writer. Generate a concise, impactful 2-3 sentence professional summary for a resume. Focus on key achievements, skills, and value proposition. Write in first person implied (no 'I' statements). Make it compelling and tailored to the person's background.\n\nName: ${contactInfo?.firstName || ""} ${contactInfo?.lastName || ""}\nExperience: ${experienceList || "Various professional roles"}\nSkills: ${skillList || "Various professional skills"}\n\nGenerate only the summary text, no quotes or additional formatting.`;

      const response = await model.generateContent(prompt);
      const summary = response.response.text() || "";

      res.json({ summary });
    } catch (error) {
      console.error("Error generating summary:", error);
      res.status(500).json({ error: "Failed to generate summary" });
    }
  });

  // Resume Management Endpoints
  app.post("/api/resumes", requireClerkAuth, async (req, res) => {
    try {
      const { title, data, templateId, colorId } = req.body;
      const userId = (req.user as any)?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Validate with schema
      const parsedData = resumeDataSchema.parse(data);

      const resume = await storage.createResume({
        title: title || "My Resume",
        data: parsedData,
        templateId: templateId || "clean",
        colorId: colorId || "blue",
        userId: userId,
      });

      res.json(resume);
    } catch (error) {
      console.error("Error saving resume:", error);
      res.status(500).json({ error: "Failed to save resume" });
    }
  });

  app.get("/api/resumes", requireClerkAuth, async (req, res) => {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const resumes = await storage.getResumesByUserId(userId);
      res.json(resumes);
    } catch (error) {
      console.error("Error listing resumes:", error);
      res.status(500).json({ error: "Failed to list resumes" });
    }
  });

  app.get("/api/resumes/:id", requireClerkAuth, async (req, res) => {
    try {
      const resume = await storage.getResume(req.params.id);
      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }
      // Ensure user owns the resume
      if (resume.userId !== (req.user as any)?.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
      res.json(resume);
    } catch (error) {
      console.error("Error fetching resume:", error);
      res.status(500).json({ error: "Failed to fetch resume" });
    }
  });

  app.patch("/api/resumes/:id", requireClerkAuth, async (req, res) => {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const existingResume = await storage.getResume(req.params.id);
      if (!existingResume) {
        return res.status(404).json({ error: "Resume not found" });
      }
      if (existingResume.userId !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

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

  app.delete("/api/resumes/:id", requireClerkAuth, async (req, res) => {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const existingResume = await storage.getResume(req.params.id);
      if (!existingResume) {
        return res.status(404).json({ error: "Resume not found" });
      }
      if (existingResume.userId !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
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

  // Cover Letter Management Endpoints
  app.post("/api/coverletters", requireClerkAuth, async (req, res) => {
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

  app.get("/api/coverletters", requireClerkAuth, async (req, res) => {
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

  app.get("/api/coverletters/:id", requireClerkAuth, async (req, res) => {
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

  app.patch("/api/coverletters/:id", requireClerkAuth, async (req, res) => {
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

  app.delete("/api/coverletters/:id", requireClerkAuth, async (req, res) => {
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
