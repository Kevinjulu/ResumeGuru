import { pgTable, text, varchar, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Resume Templates with Tier Information
export const resumeTemplates = [
  {
    id: "clean",
    name: "Clean",
    style: "professional",
    description: "Full-color sidebar with contact info and summary",
    tier: "basic",
    thumbnail: "/clean-resume-template-orange-hub.avif"
  },
  {
    id: "minimalist",
    name: "Minimalist",
    style: "simple",
    description: "Basic layout with unique skill bars",
    tier: "basic",
    thumbnail: "/minimalist-resume-template-blue-hub.webp"
  },
  {
    id: "chicago",
    name: "Chicago",
    style: "professional",
    description: "Basic design for formal industries",
    tier: "basic",
    thumbnail: "/chicago-resume-template-blue-hub.webp"
  },
  {
    id: "modern",
    name: "Modern",
    style: "modern",
    description: "Simple header with round headshot spot",
    tier: "pro",
    thumbnail: "/modern-resume-template-red-hub.avif"
  },
  {
    id: "corporate",
    name: "Corporate",
    style: "professional",
    description: "Bold full-color header with minimalist sidebar",
    tier: "pro",
    thumbnail: "/corporate-resume-template-red-hub.avif"
  },
  {
    id: "elegant",
    name: "Elegant",
    style: "creative",
    description: "Center-aligned with simple headshot at top",
    tier: "pro",
    thumbnail: "/elegant-resume-template-green-hub.avif"
  },
  {
    id: "2025",
    name: "2025",
    style: "modern",
    description: "Modern dark blue design for contemporary professionals",
    tier: "pro",
    thumbnail: "/2025-resume-builder-template-dark-blue.avif"
  },
  {
    id: "taj-mahal",
    name: "Taj Mahal",
    style: "professional",
    description: "Large sidebar for contact, summary, and education",
    tier: "pro",
    thumbnail: "/taj-mahal-resume-template-blue-hub.avif"
  },
  {
    id: "advanced",
    name: "Advanced",
    style: "creative",
    description: "Modern bubbles for contact info and skills with headshot",
    tier: "premium",
    isPremium: true,
    thumbnail: "/advanced-resume-template-navy-orange-hub.avif"
  },
  {
    id: "majestic",
    name: "Majestic",
    style: "professional",
    description: "Elegant design with sophisticated layout",
    tier: "premium",
    isPremium: true,
    thumbnail: "/majestic-resume-template-green.avif"
  },
] as const;

export type TemplateId = typeof resumeTemplates[number]["id"];
export type TemplateTier = "basic" | "pro" | "premium";

// CV Templates
export const cvTemplates = [
  { id: "classic", name: "Classic", style: "professional", description: "Traditional CV layout with clear sections" },
  { id: "modern-cv", name: "Modern", style: "modern", description: "Contemporary layout with strong headings" },
  { id: "creative-cv", name: "Creative", style: "creative", description: "Two-column layout with emphasis on skills", premium: true },
  { id: "minimal-cv", name: "Minimal", style: "simple", description: "Lightweight design focused on content" },
] as const;

export type CvTemplateId = typeof cvTemplates[number]["id"];

// Template Colors
export const templateColors = [
  { id: "orange", name: "Orange", hex: "#EA723C" },
  { id: "blue", name: "Blue", hex: "#4B94EA" },
  { id: "green", name: "Green", hex: "#2D9D78" },
  { id: "red", name: "Red", hex: "#E74C3C" },
  { id: "purple", name: "Purple", hex: "#9B59B6" },
  { id: "navy", name: "Navy", hex: "#2C3E50" },
  { id: "teal", name: "Teal", hex: "#1ABC9C" },
  { id: "dark-blue", name: "Dark Blue", hex: "#286270" },
] as const;

export type ColorId = typeof templateColors[number]["id"];

// Contact Info Schema
export const contactInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
});

export type ContactInfo = z.infer<typeof contactInfoSchema>;

// Experience Schema
export const experienceSchema = z.object({
  id: z.string(),
  jobTitle: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  bullets: z.array(z.string()).default([]),
});

export type Experience = z.infer<typeof experienceSchema>;

// Education Schema
export const educationSchema = z.object({
  id: z.string(),
  degree: z.string().min(1, "Degree is required"),
  school: z.string().min(1, "School is required"),
  location: z.string().optional(),
  graduationDate: z.string().optional(),
  gpa: z.string().optional(),
  honors: z.string().optional(),
  relevantCourses: z.array(z.string()).default([]),
});

export type Education = z.infer<typeof educationSchema>;

// Skill Schema
export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Skill name is required"),
  level: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
});

export type Skill = z.infer<typeof skillSchema>;

// Certification Schema
export const certificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().optional(),
  date: z.string().optional(),
  expirationDate: z.string().optional(),
  credentialId: z.string().optional(),
});

export type Certification = z.infer<typeof certificationSchema>;

// Complete Resume Schema
export const resumeDataSchema = z.object({
  contactInfo: contactInfoSchema.partial(),
  summary: z.string().optional(),
  experiences: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(skillSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  templateId: z.string().default("clean"),
  colorId: z.string().default("orange"),
});

export type ResumeData = z.infer<typeof resumeDataSchema>;

// Cover Letter Schema
export const coverLetterSenderSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

export const coverLetterRecipientSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

export const coverLetterDataSchema = z.object({
  senderInfo: coverLetterSenderSchema.default({}),
  recipientInfo: coverLetterRecipientSchema.default({}),
  date: z.string().default(new Date().toISOString().split("T")[0]),
  subject: z.string().default(""),
  body: z.string().default(""),
  templateId: z.string().default("basic-cl"),
  colorId: z.string().default("orange"),
});

export type CoverLetterData = z.infer<typeof coverLetterDataSchema>;

// Cover Letter Templates
export const coverLetterTemplates = [
  { id: "basic-cl", name: "Basic", style: "professional", description: "Traditional single-column cover letter" },
  { id: "modern-cl", name: "Modern", style: "modern", description: "Clean header with strong typography" },
  { id: "creative-cl", name: "Creative", style: "creative", description: "Stylized header and accent blocks", premium: true },
  { id: "elegant-cl", name: "Elegant", style: "professional", description: "Refined layout with subtle separators" },
] as const;

// Database Tables
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password"),
  accountTier: text("account_tier").notNull().default("free"),
  avatarUrl: text("avatar_url"),
  passwordResetToken: varchar("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
});

export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null", onUpdate: "cascade" }),
  title: text("title").notNull().default("My Resume"),
  data: jsonb("data").$type<ResumeData>().notNull(),
  templateId: varchar("template_id").notNull().default("clean"),
  colorId: varchar("color_id").notNull().default("orange"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const coverLetters = pgTable("cover_letters", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null", onUpdate: "cascade" }),
  title: text("title").notNull().default("My Cover Letter"),
  data: jsonb("data").$type<CoverLetterData>().notNull(),
  templateId: varchar("template_id").notNull().default("basic-cl"),
  colorId: varchar("color_id").notNull().default("orange"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  accountTier: true,
});

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCoverLetterSchema = createInsertSchema(coverLetters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Resume = typeof resumes.$inferSelect;
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type CoverLetter = typeof coverLetters.$inferSelect;
export type InsertCoverLetter = z.infer<typeof insertCoverLetterSchema>;

// Pre-written content library
export const jobCategories = [
  "Government",
  "Teacher",
  "Nurse",
  "Graphic Designer",
  "Sales",
  "IT",
  "Administrative Assistant",
  "Engineer",
  "Human Resources",
  "Customer Service",
  "Cashier",
  "Call Center",
  "Retail",
  "Accountant",
  "Marketing",
  "Lawyer",
  "Banking",
  "Developer",
] as const;

export type JobCategory = typeof jobCategories[number];

// Pre-written bullets by category
export const prewrittenBullets: Record<string, string[]> = {
  "Customer Service": [
    "Resolved customer inquiries and complaints efficiently, maintaining a 95% satisfaction rating",
    "Processed an average of 50+ customer transactions daily with accuracy and speed",
    "Trained new team members on company policies and customer service best practices",
    "Collaborated with cross-functional teams to improve customer experience",
    "Maintained detailed records of customer interactions using CRM software",
  ],
  "Sales": [
    "Exceeded monthly sales targets by 20% through strategic client relationship management",
    "Generated $500K+ in new business revenue through prospecting and cold calling",
    "Built and maintained a portfolio of 100+ active client accounts",
    "Developed and delivered compelling sales presentations to C-level executives",
    "Negotiated contracts and closed deals worth up to $100K",
  ],
  "IT": [
    "Managed and maintained IT infrastructure supporting 500+ users",
    "Reduced system downtime by 40% through proactive monitoring and maintenance",
    "Implemented security protocols that prevented data breaches",
    "Provided technical support and troubleshooting for hardware and software issues",
    "Led migration to cloud-based solutions, reducing costs by 30%",
  ],
  "Developer": [
    "Developed and maintained web applications using React, Node.js, and TypeScript",
    "Implemented RESTful APIs serving 1M+ requests daily",
    "Reduced page load times by 50% through performance optimization",
    "Collaborated with UX designers to implement responsive, accessible interfaces",
    "Participated in code reviews and maintained high code quality standards",
  ],
  "Nurse": [
    "Provided compassionate patient care to 20+ patients per shift",
    "Administered medications and treatments according to physician orders",
    "Documented patient conditions and maintained accurate medical records",
    "Collaborated with interdisciplinary teams to develop patient care plans",
    "Educated patients and families on health management and prevention",
  ],
  "Teacher": [
    "Developed engaging lesson plans aligned with curriculum standards",
    "Managed classroom of 25+ students while maintaining positive learning environment",
    "Implemented differentiated instruction to meet diverse learning needs",
    "Assessed student progress and provided constructive feedback",
    "Collaborated with parents and colleagues to support student success",
  ],
  "Engineer": [
    "Designed and implemented engineering solutions that improved efficiency by 25%",
    "Led cross-functional project teams to deliver projects on time and within budget",
    "Conducted technical analysis and prepared detailed engineering reports",
    "Ensured compliance with industry standards and safety regulations",
    "Mentored junior engineers and provided technical guidance",
  ],
  "Marketing": [
    "Developed and executed marketing campaigns that increased brand awareness by 40%",
    "Managed social media accounts with combined following of 50K+",
    "Analyzed campaign performance data and optimized strategies accordingly",
    "Created compelling content for websites, emails, and social media",
    "Collaborated with sales team to generate qualified leads",
  ],
  "Administrative Assistant": [
    "Managed executive calendars and coordinated meetings for 5+ team members",
    "Processed correspondence and maintained organized filing systems",
    "Prepared reports, presentations, and other business documents",
    "Coordinated travel arrangements and expense reporting",
    "Served as first point of contact for clients and visitors",
  ],
  "Accountant": [
    "Prepared and analyzed financial statements in accordance with GAAP",
    "Managed accounts payable and receivable processes",
    "Conducted monthly reconciliations and identified discrepancies",
    "Prepared tax returns and ensured regulatory compliance",
    "Implemented cost-saving measures that reduced expenses by 15%",
  ],
};

// Pre-written skills by category
export const prewrittenSkills: Record<string, string[]> = {
  "Customer Service": [
    "Customer Relations",
    "Problem Solving",
    "Communication",
    "CRM Software",
    "Conflict Resolution",
    "Time Management",
    "Active Listening",
    "Patience",
  ],
  "Sales": [
    "Sales Strategy",
    "Negotiation",
    "Lead Generation",
    "CRM Software",
    "Presentation Skills",
    "Relationship Building",
    "Cold Calling",
    "Closing Techniques",
  ],
  "IT": [
    "Network Administration",
    "Cybersecurity",
    "Cloud Computing",
    "Technical Support",
    "System Administration",
    "Database Management",
    "Troubleshooting",
    "ITIL",
  ],
  "Developer": [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "SQL",
    "Git",
    "Agile/Scrum",
    "REST APIs",
    "HTML/CSS",
  ],
  "Nurse": [
    "Patient Care",
    "Medical Terminology",
    "EMR Systems",
    "Medication Administration",
    "Vital Signs",
    "Patient Education",
    "Critical Thinking",
    "Compassion",
  ],
  "Teacher": [
    "Curriculum Development",
    "Classroom Management",
    "Lesson Planning",
    "Student Assessment",
    "Educational Technology",
    "Differentiated Instruction",
    "Parent Communication",
    "Patience",
  ],
  "Engineer": [
    "CAD Software",
    "Project Management",
    "Technical Analysis",
    "Problem Solving",
    "Quality Assurance",
    "AutoCAD",
    "MATLAB",
    "Technical Writing",
  ],
  "Marketing": [
    "Digital Marketing",
    "Social Media",
    "Content Creation",
    "SEO/SEM",
    "Analytics",
    "Email Marketing",
    "Brand Management",
    "Copywriting",
  ],
  "Administrative Assistant": [
    "Microsoft Office",
    "Calendar Management",
    "Data Entry",
    "Filing Systems",
    "Communication",
    "Multi-tasking",
    "Scheduling",
    "Organization",
  ],
  "Accountant": [
    "Financial Analysis",
    "QuickBooks",
    "Excel",
    "GAAP",
    "Tax Preparation",
    "Auditing",
    "Budgeting",
    "Accounts Payable/Receivable",
  ],
};

// Pricing Plans - Updated Structure with Strict Feature Enforcement
export const pricingPlans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    popular: false,
    // Free Plan Features
    features: [
      "1 Resume",
      "3 Basic Templates",
      "Text Formatting",
      "TXT Download",
      "Online Editor",
    ],
    // Features NOT available in Free plan
    limitations: [
      "No PDF/Word Export",
      "No AI Features",
      "Watermark on Downloads",
      "No Cover Letters",
      "No Priority Support",
      "Limited Templates",
    ],
    // Strict Feature Gating
    access: {
      maxResumes: 1,
      maxTemplates: 3,
      aiFeatures: false,
      pdfExport: false,
      wordExport: false,
      coverLetters: false,
      prioritySupport: false,
      linkedinOptimization: false,
      atsCompatibility: false,
      resumeReview: false,
      watermark: true,
    },
  },
  {
    id: "pro",
    name: "Pro",
    price: 2,
    period: "month",
    popular: true,
    // Pro Plan Features (includes all Free features + Pro additions)
    features: [
      "Everything in Free",
      "Unlimited Resumes",
      "All 10+ Templates",
      "PDF & Word Export",
      "No Watermark",
      "AI Summary Generator",
      "Color Customization",
      "Keyword Optimization",
    ],
    limitations: [
      "No Cover Letters",
      "No Priority Support",
      "No LinkedIn Optimization",
      "No Resume Review",
    ],
    // Strict Feature Gating
    access: {
      maxResumes: 999,
      maxTemplates: 999,
      aiFeatures: true,
      pdfExport: true,
      wordExport: true,
      coverLetters: false,
      prioritySupport: false,
      linkedinOptimization: false,
      atsCompatibility: true,
      resumeReview: false,
      watermark: false,
    },
  },
  {
    id: "premium",
    name: "Premium",
    price: 7,
    period: "month",
    popular: false,
    // Premium Plan Features (includes all Pro features + Premium additions)
    features: [
      "Everything in Pro",
      "Cover Letter Builder",
      "Unlimited Cover Letters",
      "Priority Support (24/7)",
      "LinkedIn Profile Optimizer",
      "ATS Compatibility Report",
      "Expert Resume Review",
      "Advanced Analytics",
      "Custom Domain",
      "Portfolio Website",
    ],
    limitations: [],
    // Strict Feature Gating
    access: {
      maxResumes: 999,
      maxTemplates: 999,
      aiFeatures: true,
      pdfExport: true,
      wordExport: true,
      coverLetters: true,
      prioritySupport: true,
      linkedinOptimization: true,
      atsCompatibility: true,
      resumeReview: true,
      watermark: false,
    },
  },
] as const;

export type PricingPlan = typeof pricingPlans[number];

// Feature Access Helper - Strict enforcement
export function hasFeatureAccess(planId: string, feature: keyof (typeof pricingPlans)[number]['access']): boolean {
  const plan = pricingPlans.find(p => p.id === planId);
  if (!plan) return false;
  return plan.access[feature];
}

// Get plan by ID
export function getPlanById(planId: string) {
  return pricingPlans.find(p => p.id === planId);
}

// Feature comparison matrix for detailed display
export const featureComparisonMatrix = [
  { name: "Resumes", category: "Core" },
  { name: "Templates", category: "Core" },
  { name: "PDF/Word Export", category: "Export" },
  { name: "No Watermark", category: "Export" },
  { name: "AI Summary Generator", category: "AI" },
  { name: "Keyword Optimization", category: "AI" },
  { name: "ATS Compatibility Check", category: "AI" },
  { name: "Cover Letter Builder", category: "Advanced" },
  { name: "LinkedIn Optimization", category: "Advanced" },
  { name: "Priority Support", category: "Support" },
  { name: "Expert Resume Review", category: "Support" },
  { name: "Portfolio Website", category: "Advanced" },
] as const;

// Template Access Control Helper Functions
export function getAvailableTemplates(accountTier: string) {
  if (accountTier === "premium") {
    return resumeTemplates; // All templates
  }

  if (accountTier === "pro") {
    return resumeTemplates.filter(t => t.tier === "basic" || t.tier === "pro");
  }

  // Free tier - only basic templates
  return resumeTemplates.filter(t => t.tier === "basic");
}

export function canAccessTemplate(templateId: string, accountTier: string): boolean {
  const template = resumeTemplates.find(t => t.id === templateId);
  if (!template) return false;

  if (accountTier === "premium") return true;
  if (accountTier === "pro") return template.tier === "basic" || template.tier === "pro";

  // Free tier
  return template.tier === "basic";
}

export function getRequiredTier(templateId: string): TemplateTier | null {
  const template = resumeTemplates.find(t => t.id === templateId);
  return template?.tier || null;
}

export function getTierDisplayName(tier: TemplateTier): string {
  const tierNames = {
    basic: "Free",
    pro: "Pro",
    premium: "Premium"
  };
  return tierNames[tier];
}

