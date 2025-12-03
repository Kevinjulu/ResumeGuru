import { pgTable, text, varchar, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Resume Templates
export const resumeTemplates = [
  { id: "clean", name: "Clean", style: "professional", description: "Full-color sidebar with contact info and summary" },
  { id: "taj-mahal", name: "Taj Mahal", style: "professional", description: "Large sidebar for contact, summary, and education" },
  { id: "2025", name: "2025", style: "modern", description: "Modern dark blue design for contemporary professionals", premium: true },
  { id: "corporate", name: "Corporate", style: "professional", description: "Bold full-color header with minimalist sidebar" },
  { id: "advanced", name: "Advanced", style: "creative", description: "Modern bubbles for contact info and skills with headshot", premium: true },
  { id: "majestic", name: "Majestic", style: "professional", description: "Elegant design with sophisticated layout", premium: true },
  { id: "modern", name: "Modern", style: "modern", description: "Simple header with round headshot spot" },
  { id: "minimalist", name: "Minimalist", style: "simple", description: "Basic layout with unique skill bars" },
  { id: "elegant", name: "Elegant", style: "creative", description: "Center-aligned with simple headshot at top" },
  { id: "chicago", name: "Chicago", style: "professional", description: "Basic design for formal industries" },
  { id: "neo", name: "Neo", style: "modern", description: "Large accent header with crisp typography", premium: true },
  { id: "sidebar-pro", name: "Sidebar Pro", style: "professional", description: "Two-column layout with colored sidebar", premium: true },
  { id: "timeline", name: "Timeline", style: "modern", description: "Vertical experience timeline with bold dates", premium: true },
  { id: "compact", name: "Compact", style: "simple", description: "Space-efficient two-column details" },
  { id: "slate", name: "Slate", style: "modern", description: "Subtle gradient with clean typography" },
  { id: "bold", name: "Bold", style: "modern", description: "Striking header with color accents", premium: true },
  { id: "two-column", name: "Two Column", style: "creative", description: "Eye-catching dual column layout", premium: true },
  { id: "hybrid", name: "Hybrid", style: "modern", description: "Highlighted skills with focused experience" },
  { id: "standard", name: "Standard", style: "professional", description: "Well-balanced resume with clear hierarchy" },
  { id: "unique", name: "Unique", style: "creative", description: "Clean design with logical structure", premium: true },
  { id: "quick", name: "Quick", style: "modern", description: "Readable layout optimized for speed" },
  { id: "premium", name: "Premium", style: "professional", description: "Sleek header and custom icons", premium: true },
  { id: "pastel", name: "Pastel", style: "creative", description: "Soft accents with open spacing" },
] as const;

export type TemplateId = typeof resumeTemplates[number]["id"];

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

export const templateTypography: Record<TemplateId, {
  headerFamily: string;
  bodyFamily: string;
  headerWeight: number;
  bodyWeight: number;
}> = {
  clean: { headerFamily: "Poppins", bodyFamily: "Inter", headerWeight: 700, bodyWeight: 400 },
  "taj-mahal": { headerFamily: "Playfair Display", bodyFamily: "Inter", headerWeight: 700, bodyWeight: 400 },
  "2025": { headerFamily: "Lora", bodyFamily: "Open Sans", headerWeight: 700, bodyWeight: 400 },
  corporate: { headerFamily: "Montserrat", bodyFamily: "Inter", headerWeight: 700, bodyWeight: 400 },
  advanced: { headerFamily: "Poppins", bodyFamily: "Open Sans", headerWeight: 700, bodyWeight: 400 },
  majestic: { headerFamily: "Libre Baskerville", bodyFamily: "Inter", headerWeight: 700, bodyWeight: 400 },
  modern: { headerFamily: "Outfit", bodyFamily: "Inter", headerWeight: 700, bodyWeight: 400 },
  minimalist: { headerFamily: "Space Grotesk", bodyFamily: "Inter", headerWeight: 600, bodyWeight: 400 },
  elegant: { headerFamily: "Playfair Display", bodyFamily: "Inter", headerWeight: 700, bodyWeight: 400 },
  chicago: { headerFamily: "PT Sans", bodyFamily: "Inter", headerWeight: 700, bodyWeight: 400 },
  neo: { headerFamily: "Outfit", bodyFamily: "Inter", headerWeight: 800, bodyWeight: 400 },
  "sidebar-pro": { headerFamily: "Montserrat", bodyFamily: "Inter", headerWeight: 700, bodyWeight: 400 },
  timeline: { headerFamily: "Poppins", bodyFamily: "Inter", headerWeight: 700, bodyWeight: 400 },
  compact: { headerFamily: "Inter", bodyFamily: "Inter", headerWeight: 700, bodyWeight: 400 },
  slate: { headerFamily: "Gabarito", bodyFamily: "Inter", headerWeight: 700, bodyWeight: 400 },
  bold: { headerFamily: "Outfit", bodyFamily: "Roboto", headerWeight: 800, bodyWeight: 400 },
  "two-column": { headerFamily: "Barlow", bodyFamily: "Manrope", headerWeight: 700, bodyWeight: 400 },
  hybrid: { headerFamily: "Roboto", bodyFamily: "Roboto", headerWeight: 700, bodyWeight: 400 },
  standard: { headerFamily: "PT Sans", bodyFamily: "Raleway", headerWeight: 700, bodyWeight: 400 },
  unique: { headerFamily: "Montserrat", bodyFamily: "Inter", headerWeight: 700, bodyWeight: 400 },
  quick: { headerFamily: "Inter", bodyFamily: "Inter", headerWeight: 700, bodyWeight: 400 },
  premium: { headerFamily: "Barlow", bodyFamily: "Martian Mono", headerWeight: 700, bodyWeight: 400 },
  pastel: { headerFamily: "Arima", bodyFamily: "Raleway", headerWeight: 700, bodyWeight: 400 },
};

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
  layoutVariant: z.enum(["single", "double"]).optional(),
  sectionOrder: z
    .array(z.enum(["summary", "experience", "education", "skills", "certifications"]))
    .default(["summary", "experience", "education", "skills", "certifications"]),
});

export type ResumeData = z.infer<typeof resumeDataSchema>;

// Database Tables
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  accountTier: varchar("account_tier").notNull().default("free"),
});

export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id"),
  title: text("title").notNull().default("My Resume"),
  data: jsonb("data").$type<ResumeData>().notNull(),
  templateId: varchar("template_id").notNull().default("clean"),
  colorId: varchar("color_id").notNull().default("orange"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  tier: varchar("tier").notNull(),
  status: varchar("status").notNull().default("active"),
  currentPeriodStart: timestamp("current_period_start").defaultNow(),
  currentPeriodEnd: timestamp("current_period_end"),
  renewalDate: timestamp("renewal_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payments / Receipts
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  tier: varchar("tier").notNull(),
  amount: integer("amount_cents").notNull(),
  currency: varchar("currency").notNull().default("USD"),
  provider: varchar("provider").notNull().default("paypal"),
  providerOrderId: varchar("provider_order_id"),
  providerCaptureId: varchar("provider_capture_id"),
  receiptEncrypted: text("receipt_encrypted"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payment audit logs
export const paymentAudit = pgTable("payment_audit", {
  id: varchar("id").primaryKey(),
  endpoint: varchar("endpoint").notNull(),
  userId: varchar("user_id"),
  payloadEncrypted: text("payload_encrypted"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  accountTier: true,
});

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Resume = typeof resumes.$inferSelect;
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

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

// Pricing Plans
export const pricingPlans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    features: [
      "1 Resume",
      "3 Templates",
      "Basic formatting",
      "TXT download only",
    ],
    limitations: ["No AI features", "No PDF/Word export", "Watermark on downloads"],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 7.95,
    period: "month",
    features: [
      "Unlimited Resumes",
      "All 10+ Templates",
      "AI Summary Generator",
      "PDF & Word downloads",
      "No watermarks",
      "Color customization",
    ],
    limitations: [],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 24.95,
    period: "3 months",
    features: [
      "Everything in Pro",
      "Cover letter builder",
      "Priority support",
      "LinkedIn optimization",
      "ATS compatibility check",
      "1-on-1 resume review",
    ],
    limitations: [],
    popular: false,
  },
] as const;

export type PricingPlan = typeof pricingPlans[number];
