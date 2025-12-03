import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import {
  users,
  resumes,
  coverLetters,
  type ResumeData,
  type CoverLetterData,
  templateColors,
  resumeDataSchema,
  coverLetterDataSchema,
} from "@shared/schema";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required to seed the database");
  }
  const sql = neon(url);
  const db = drizzle(sql);

  const aliceId = randomUUID();
  const bobId = randomUUID();

  await db.insert(users).values([
    {
      id: aliceId,
      username: "alice",
      email: "alice@example.com",
      password: "seeded-password-hash",
      accountTier: "premium",
    },
    {
      id: bobId,
      username: "bob",
      email: "bob@example.com",
      password: "seeded-password-hash",
      accountTier: "free",
    },
  ]);

  const aliceResume: ResumeData = {
    contactInfo: {
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@example.com",
      phone: "(555) 123-4567",
      city: "Austin",
      state: "TX",
      linkedin: "https://linkedin.com/in/alicejohnson",
      website: "https://alice.dev",
    },
    summary:
      "Full‑stack developer with 7+ years building performant web applications. Passionate about DX and accessibility.",
    experiences: [
      {
        id: randomUUID(),
        jobTitle: "Senior Software Engineer",
        company: "Acme Corp",
        location: "Remote",
        startDate: "2021-06",
        endDate: "",
        current: true,
        description:
          "Led React/Node platform modernization; mentored 4 engineers; drove performance initiatives.",
        bullets: [
          "Reduced Largest Contentful Paint by 45% via code splitting and caching",
          "Designed and shipped GraphQL gateway serving 2M req/day",
          "Implemented CI/CD with preview environments, cutting release time by 60%",
        ],
      },
      {
        id: randomUUID(),
        jobTitle: "Software Engineer",
        company: "Beta Labs",
        location: "Austin, TX",
        startDate: "2018-04",
        endDate: "2021-05",
        current: false,
        description: "Built internal tools and customer dashboards",
        bullets: [
          "Developed role‑based access control and audit logging",
          "Migrated legacy jQuery app to React and TypeScript",
        ],
      },
    ],
    education: [
      {
        id: randomUUID(),
        degree: "B.S. Computer Science",
        school: "UT Austin",
        location: "Austin, TX",
        graduationDate: "2017-05",
        gpa: "3.7",
        honors: "Dean's List",
        relevantCourses: ["Algorithms", "Distributed Systems", "Databases"],
      },
    ],
    skills: [
      { id: randomUUID(), name: "TypeScript", level: "expert" },
      { id: randomUUID(), name: "React", level: "expert" },
      { id: randomUUID(), name: "Node.js", level: "advanced" },
      { id: randomUUID(), name: "PostgreSQL", level: "advanced" },
    ],
    certifications: [
      { id: randomUUID(), name: "AWS Certified Cloud Practitioner", issuer: "AWS", date: "2022" },
    ],
    templateId: "clean",
    colorId: templateColors[1].id,
  };

  const bobResume: ResumeData = {
    contactInfo: {
      firstName: "Bob",
      lastName: "Nguyen",
      email: "bob@example.com",
      phone: "(555) 987-6543",
      city: "Seattle",
      state: "WA",
    },
    summary: "Support specialist transitioning into software QA.",
    experiences: [],
    education: [],
    skills: [
      { id: randomUUID(), name: "Communication" },
      { id: randomUUID(), name: "Troubleshooting" },
    ],
    certifications: [],
    templateId: "minimalist",
    colorId: templateColors[0].id,
  };

  // Validate before insert
  const validAlice = resumeDataSchema.parse(aliceResume);
  const validBob = resumeDataSchema.parse(bobResume);

  await db.insert(resumes).values([
    {
      id: randomUUID(),
      userId: aliceId,
      title: "Alice Johnson – Resume",
      data: validAlice,
      templateId: validAlice.templateId,
      colorId: validAlice.colorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: randomUUID(),
      userId: bobId,
      title: "Bob Nguyen – Resume",
      data: validBob,
      templateId: validBob.templateId,
      colorId: validBob.colorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const aliceCoverLetter: CoverLetterData = {
    senderInfo: {
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@example.com",
      phone: "(555) 123-4567",
      city: "Austin",
      state: "TX",
    },
    recipientInfo: {
      name: "Jane Smith",
      title: "Hiring Manager",
      company: "Acme Corp",
      city: "New York",
      state: "NY",
    },
    date: new Date().toISOString().split("T")[0],
    subject: "Application for Senior Software Engineer",
    body:
      "I am excited to apply for the Senior Software Engineer role at Acme Corp. Over the past seven years, I have built scalable, accessible web applications and led teams shipping complex features. I would love to bring my experience in React, Node.js, and GraphQL to your platform.",
    templateId: "modern-cl",
    colorId: templateColors[1].id,
  };

  const validAliceCL = coverLetterDataSchema.parse(aliceCoverLetter);

  await db.insert(coverLetters).values([
    {
      id: randomUUID(),
      userId: aliceId,
      title: "Alice – Cover Letter for Acme",
      data: validAliceCL,
      templateId: validAliceCL.templateId,
      colorId: validAliceCL.colorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  console.log("Seed complete: inserted users, resumes, and cover letters");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

