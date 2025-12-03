import { type User, type InsertUser, type Resume, type InsertResume, type ResumeData, users, resumes } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import ConvexStorage from "./convexStorage";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getResume(id: string): Promise<Resume | undefined>;
  getResumesByUserId(userId: string): Promise<Resume[]>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: string, data: Partial<Resume>): Promise<Resume | undefined>;
  deleteResume(id: string, userId?: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private resumes: Map<string, Resume>;

  constructor() {
    this.users = new Map();
    this.resumes = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getResume(id: string): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async getResumesByUserId(userId: string): Promise<Resume[]> {
    return Array.from(this.resumes.values()).filter(
      (resume) => resume.userId === userId,
    );
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = randomUUID();
    const now = new Date();
    const resume: Resume = {
      id,
      userId: insertResume.userId || null,
      title: insertResume.title || "My Resume",
      data: insertResume.data as ResumeData,
      templateId: insertResume.templateId || "clean",
      colorId: insertResume.colorId || "orange",
      createdAt: now,
      updatedAt: now,
    };
    this.resumes.set(id, resume);
    return resume;
  }

  async updateResume(id: string, data: Partial<Resume>): Promise<Resume | undefined> {
    const resume = this.resumes.get(id);
    if (!resume) return undefined;

    const updated: Resume = {
      ...resume,
      ...data,
      updatedAt: new Date(),
    };
    this.resumes.set(id, updated);
    return updated;
  }

  async deleteResume(id: string, _userId?: string): Promise<boolean> {
    return this.resumes.delete(id);
  }


}

class DbStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor(connectionString: string) {
    const sql = neon(connectionString);
    this.db = drizzle(sql);
  }

  async getUser(id: string): Promise<User | undefined> {
    const rows = await this.db.select().from(users).where(eq(users.id, id));
    return rows[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const rows = await this.db.select().from(users).where(eq(users.username, username));
    return rows[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const [row] = await this.db
      .insert(users)
      .values({
        id,
        username: insertUser.username,
        email: (insertUser as any).email ?? `${insertUser.username}@example.com`,
        password: insertUser.password,
        accountTier: (insertUser as any).accountTier ?? "free",
      })
      .returning();
    return row as User;
  }

  async getResume(id: string): Promise<Resume | undefined> {
    const rows = await this.db.select().from(resumes).where(eq(resumes.id, id));
    return rows[0];
  }

  async getResumesByUserId(userId: string): Promise<Resume[]> {
    const rows = await this.db.select().from(resumes).where(eq(resumes.userId, userId));
    return rows as Resume[];
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = randomUUID();
    const now = new Date();
    const [row] = await this.db
      .insert(resumes)
      .values({
        id,
        userId: insertResume.userId ?? null,
        title: insertResume.title ?? "My Resume",
        data: insertResume.data as ResumeData,
        templateId: insertResume.templateId ?? "clean",
        colorId: insertResume.colorId ?? "orange",
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    return row as Resume;
  }

  async updateResume(id: string, data: Partial<Resume>): Promise<Resume | undefined> {
    const [row] = await this.db
      .update(resumes)
      .set({
        userId: data.userId ?? undefined,
        title: data.title ?? undefined,
        data: (data.data as ResumeData) ?? undefined,
        templateId: data.templateId ?? undefined,
        colorId: data.colorId ?? undefined,
        updatedAt: new Date(),
      })
      .where(eq(resumes.id, id))
      .returning();
    return row as Resume | undefined;
  }

  async deleteResume(id: string, _userId?: string): Promise<boolean> {
    const res = await this.db.delete(resumes).where(eq(resumes.id, id)).returning();
    return res.length > 0;
  }
}

function makeStorage(): IStorage {
  const convexUrl = process.env.CONVEX_URL;
  if (convexUrl) {
    try {
      return new ConvexStorage(convexUrl) as unknown as IStorage;
    } catch (e) {
      console.error("Failed to initialize ConvexStorage:", e);
    }
  }
  const url = process.env.DATABASE_URL;
  if (url) {
    return new DbStorage(url);
  }
  return new MemStorage();
}

export const storage: IStorage = makeStorage();
