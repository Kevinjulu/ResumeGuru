import { type User, type InsertUser, type Resume, type InsertResume, type ResumeData, type Subscription, type InsertSubscription, type Payment, type InsertPayment, users, resumes, subscriptions, payments, paymentAudit } from "@shared/schema.ts";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByPasswordResetToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;
  
  getResume(id: string): Promise<Resume | undefined>;
  getResumesByUserId(userId: string): Promise<Resume[]>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: string, data: Partial<Resume>): Promise<Resume | undefined>;
  deleteResume(id: string): Promise<boolean>;

  getCoverLetter(id: string): Promise<CoverLetter | undefined>;
  getCoverLettersByUserId(userId: string): Promise<CoverLetter[]>;
  createCoverLetter(coverLetter: InsertCoverLetter): Promise<CoverLetter>;
  updateCoverLetter(id: string, data: Partial<CoverLetter>): Promise<CoverLetter | undefined>;
  deleteCoverLetter(id: string): Promise<boolean>;

  getSubscriptionByUserId(userId: string): Promise<Subscription | undefined>;
  upsertSubscription(userId: string, data: Omit<InsertSubscription, "userId"> & { tier: string }): Promise<Subscription>;
  addPayment(payment: InsertPayment): Promise<Payment>;
  listPaymentsByUserId(userId: string): Promise<Payment[]>;
  addPaymentAudit(entry: { endpoint: string; userId?: string | null; payloadEncrypted?: string | null }): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private resumes: Map<string, Resume>;
  private coverLetters: Map<string, CoverLetter>; // New map for cover letters
  private subs: Map<string, Subscription>;
  private pay: Map<string, Payment>;
  private audits: { id: string; endpoint: string; userId?: string | null; payloadEncrypted?: string | null; createdAt: Date }[];

  constructor() {
    this.users = new Map();
    this.resumes = new Map();
    this.coverLetters = new Map(); // Initialize cover letters map
    this.subs = new Map();
    this.pay = new Map();
    this.audits = [];
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByPasswordResetToken(token: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.passwordResetToken === token,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, accountTier: insertUser.accountTier ?? "free" } as User;
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const u = this.users.get(id);
    if (!u) return undefined;
    const updated = { ...u, ...data };
    this.users.set(id, updated);
    return updated;
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

  async deleteResume(id: string): Promise<boolean> {
    return this.resumes.delete(id);
  }

  async getCoverLetter(id: string): Promise<CoverLetter | undefined> {
    return this.coverLetters.get(id);
  }

  async getCoverLettersByUserId(userId: string): Promise<CoverLetter[]> {
    return Array.from(this.coverLetters.values()).filter(
      (cl) => cl.userId === userId,
    );
  }

  async createCoverLetter(insertCoverLetter: InsertCoverLetter): Promise<CoverLetter> {
    const id = randomUUID();
    const now = new Date();
    const coverLetter: CoverLetter = {
      id,
      userId: insertCoverLetter.userId || null,
      title: insertCoverLetter.title || "My Cover Letter",
      data: insertCoverLetter.data as CoverLetterData,
      templateId: insertCoverLetter.templateId || "basic-cl",
      colorId: insertCoverLetter.colorId || "orange",
      createdAt: now,
      updatedAt: now,
    };
    this.coverLetters.set(id, coverLetter);
    return coverLetter;
  }

  async updateCoverLetter(id: string, data: Partial<CoverLetter>): Promise<CoverLetter | undefined> {
    const coverLetter = this.coverLetters.get(id);
    if (!coverLetter) return undefined;

    const updated: CoverLetter = {
      ...coverLetter,
      ...data,
      updatedAt: new Date(),
    };
    this.coverLetters.set(id, updated);
    return updated;
  }

  async deleteCoverLetter(id: string): Promise<boolean> {
    return this.coverLetters.delete(id);
  }

  async getSubscriptionByUserId(userId: string): Promise<Subscription | undefined> {
    return this.subs.get(userId);
  }

  async upsertSubscription(userId: string, data: Omit<InsertSubscription, "userId"> & { tier: string }): Promise<Subscription> {
    const now = new Date();
    const sub: Subscription = {
      id: this.subs.get(userId)?.id || randomUUID(),
      userId,
      tier: data.tier,
      status: (data as any).status || "active",
      currentPeriodStart: (data as any).currentPeriodStart || now,
      currentPeriodEnd: (data as any).currentPeriodEnd || undefined,
      renewalDate: (data as any).renewalDate || undefined,
      createdAt: this.subs.get(userId)?.createdAt || now,
      updatedAt: now,
    } as Subscription;
    this.subs.set(userId, sub);
    return sub;
  }

  async addPayment(payment: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const rec: Payment = {
      id,
      userId: payment.userId!,
      tier: payment.tier!,
      amount: payment.amount!,
      currency: payment.currency || "USD",
      provider: payment.provider || "paypal",
      providerOrderId: payment.providerOrderId || null,
      providerCaptureId: payment.providerCaptureId || null,
      receiptEncrypted: (payment as any).receiptEncrypted || null,
      createdAt: new Date(),
    } as unknown as Payment;
    this.pay.set(id, rec);
    return rec;
  }

  async listPaymentsByUserId(userId: string): Promise<Payment[]> {
    return Array.from(this.pay.values()).filter(p => p.userId === userId);
  }

  async addPaymentAudit(entry: { endpoint: string; userId?: string | null; payloadEncrypted?: string | null }): Promise<void> {
    this.audits.push({ id: randomUUID(), endpoint: entry.endpoint, userId: entry.userId ?? null, payloadEncrypted: entry.payloadEncrypted ?? null, createdAt: new Date() });
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

  async getUserByPasswordResetToken(token: string): Promise<User | undefined> {
    const rows = await this.db.select().from(users).where(eq(users.passwordResetToken, token));
    return rows[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const [row] = await this.db
      .insert(users)
      .values({ id, username: insertUser.username, password: insertUser.password, accountTier: insertUser.accountTier ?? "free" })
      .returning();
    return row as User;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const [row] = await this.db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return row as User | undefined;
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

  async deleteResume(id: string): Promise<boolean> {
    const res = await this.db.delete(resumes).where(eq(resumes.id, id)).returning();
    return res.length > 0;
  }

  async getCoverLetter(id: string): Promise<CoverLetter | undefined> {
    const rows = await this.db.select().from(coverLetters).where(eq(coverLetters.id, id));
    return rows[0];
  }

  async getCoverLettersByUserId(userId: string): Promise<CoverLetter[]> {
    const rows = await this.db.select().from(coverLetters).where(eq(coverLetters.userId, userId));
    return rows as CoverLetter[];
  }

  async createCoverLetter(insertCoverLetter: InsertCoverLetter): Promise<CoverLetter> {
    const id = randomUUID();
    const now = new Date();
    const [row] = await this.db
      .insert(coverLetters)
      .values({
        id,
        userId: insertCoverLetter.userId ?? null,
        title: insertCoverLetter.title ?? "My Cover Letter",
        data: insertCoverLetter.data as CoverLetterData,
        templateId: insertCoverLetter.templateId ?? "basic-cl",
        colorId: insertCoverLetter.colorId ?? "orange",
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    return row as CoverLetter;
  }

  async updateCoverLetter(id: string, data: Partial<CoverLetter>): Promise<CoverLetter | undefined> {
    const [row] = await this.db
      .update(coverLetters)
      .set({
        userId: data.userId ?? undefined,
        title: data.title ?? undefined,
        data: (data.data as CoverLetterData) ?? undefined,
        templateId: data.templateId ?? undefined,
        colorId: data.colorId ?? undefined,
        updatedAt: new Date(),
      })
      .where(eq(coverLetters.id, id))
      .returning();
    return row as CoverLetter | undefined;
  }

  async deleteCoverLetter(id: string): Promise<boolean> {
    const res = await this.db.delete(coverLetters).where(eq(coverLetters.id, id)).returning();
    return res.length > 0;
  }

  async getSubscriptionByUserId(userId: string): Promise<Subscription | undefined> {
    const rows = await this.db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
    return rows[0] as Subscription | undefined;
  }

  async upsertSubscription(userId: string, data: Omit<InsertSubscription, "userId"> & { tier: string }): Promise<Subscription> {
    const existing = await this.getSubscriptionByUserId(userId);
    if (existing) {
      const [row] = await this.db
        .update(subscriptions)
        .set({
          tier: data.tier,
          status: (data as any).status ?? undefined,
          currentPeriodStart: (data as any).currentPeriodStart ?? undefined,
          currentPeriodEnd: (data as any).currentPeriodEnd ?? undefined,
          renewalDate: (data as any).renewalDate ?? undefined,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.userId, userId))
        .returning();
      return row as Subscription;
    } else {
      const [row] = await this.db
        .insert(subscriptions)
        .values({
          id: randomUUID(),
          userId,
          tier: data.tier,
          status: (data as any).status ?? "active",
          currentPeriodStart: (data as any).currentPeriodStart ?? new Date(),
          currentPeriodEnd: (data as any).currentPeriodEnd ?? undefined,
          renewalDate: (data as any).renewalDate ?? undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      return row as Subscription;
    }
  }

  async addPayment(payment: InsertPayment): Promise<Payment> {
    const [row] = await this.db
      .insert(payments)
      .values({
        id: randomUUID(),
        userId: payment.userId!,
        tier: payment.tier!,
        amount: payment.amount!,
        currency: payment.currency || "USD",
        provider: payment.provider || "paypal",
        providerOrderId: payment.providerOrderId ?? undefined,
        providerCaptureId: payment.providerCaptureId ?? undefined,
        receiptEncrypted: (payment as any).receiptEncrypted ?? undefined,
        createdAt: new Date(),
      })
      .returning();
    return row as Payment;
  }

  async listPaymentsByUserId(userId: string): Promise<Payment[]> {
    const rows = await this.db.select().from(payments).where(eq(payments.userId, userId));
    return rows as Payment[];
  }

  async addPaymentAudit(entry: { endpoint: string; userId?: string | null; payloadEncrypted?: string | null }): Promise<void> {
    await this.db
      .insert(paymentAudit)
      .values({
        id: randomUUID(),
        endpoint: entry.endpoint,
        userId: entry.userId ?? undefined,
        payloadEncrypted: entry.payloadEncrypted ?? undefined,
        createdAt: new Date(),
      });
  }
}

function makeStorage(): IStorage {
  const url = process.env.DATABASE_URL;
  if (url) {
    return new DbStorage(url);
  }
  return new MemStorage();
}

export const storage: IStorage = makeStorage();
