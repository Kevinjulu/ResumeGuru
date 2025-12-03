import { ConvexHttpClient } from "convex/browser";

// Lightweight in-memory fallback for user operations while Clerk is being wired.
class SimpleUserFallback {
  private users = new Map<string, any>();

  async getUser(id: string) {
    return this.users.get(id);
  }

  async getUserByUsername(username: string) {
    return Array.from(this.users.values()).find((u) => u.username === username);
  }

  async createUser(user: any) {
    const id = user.id || cryptoRandom();
    const u = { ...user, id };
    this.users.set(id, u);
    return u;
  }

  async updateUser(id: string, data: any) {
    const u = this.users.get(id);
    if (!u) return undefined;
    const updated = { ...u, ...data };
    this.users.set(id, updated);
    return updated;
  }

  async deleteUser(id: string) {
    return this.users.delete(id);
  }
}

function cryptoRandom() {
  return Math.random().toString(36).slice(2, 10);
}

export class ConvexStorage {
  private client: any;
  private fallback: SimpleUserFallback;

  constructor(url: string) {
    this.client = new ConvexHttpClient(url);
    this.fallback = new SimpleUserFallback();
  }

  // User-related methods: keep using in-memory fallback for now.
  async getUser(id: string) {
    return this.fallback.getUser(id);
  }

  async getUserByUsername(username: string) {
    return this.fallback.getUserByUsername(username);
  }

  async createUser(user: any) {
    return this.fallback.createUser(user);
  }

  // Resume methods use Convex where possible
  async getResume(id: string) {
    // try to find in Convex by scanning user's resumes (best-effort)
    // NOTE: This is a simple implementation; for production add a dedicated Convex query.
    const all = await this.client.query("resumes:getResumes", { userId: undefined }).catch(() => []);
    const found = (all || []).find((r: any) => r._id === id || r.id === id);
    return found || undefined;
  }

  async getResumesByUserId(userId: string) {
    const res = await this.client.query("resumes:getResumes", { userId }).catch(() => []);
    // Convex returns documents with internal id in `_id` property; normalize to `id` if needed
    return (res || []).map((r: any) => ({ ...r, id: r._id ?? r.id }));
  }

  async createResume(resume: any) {
    const args = {
      title: resume.title,
      templateId: resume.templateId,
      colorId: resume.colorId,
      data: resume.data,
      userId: resume.userId ?? null,
    };
    const docId = await this.client.mutation("resumes:createResume", args);
    // return a shape compatible with MemStorage/DbStorage
    return {
      id: docId,
      userId: args.userId ?? null,
      title: args.title,
      data: args.data,
      templateId: args.templateId,
      colorId: args.colorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async updateResume(id: string, data: Partial<any>) {
    try {
      const clerkUserId = (data as any)?.userId;
      const args = { id, data, userId: clerkUserId };
      const updated = await this.client.mutation("resumes:updateResume", args);
      // normalize id
      if (updated && (updated as any)._id) updated.id = (updated as any)._id;
      return updated;
    } catch (e) {
      // fallback behavior: merge locally
      const existing = await this.getResume(id);
      if (!existing) return undefined;
      const merged = { ...existing, ...data, updatedAt: new Date() };
      return merged as any;
    }
  }

  async deleteResume(id: string, userId?: string) {
    // Try calling convex delete mutation which accepts optional userId
    try {
      await this.client.mutation("resumes:deleteResume", { id, userId });
      return true;
    } catch (e) {
      return false;
    }
  }

  // Cover letter operations
  async getCoverLetter(id: string) {
    const all = await this.client.query("coverLetters:getCoverLetters", { userId: undefined }).catch(() => []);
    return (all || []).find((r: any) => r._id === id || r.id === id) || undefined;
  }

  async getCoverLettersByUserId(userId: string) {
    const res = await this.client.query("coverLetters:getCoverLetters", { userId }).catch(() => []);
    return (res || []).map((r: any) => ({ ...r, id: r._id ?? r.id }));
  }

  async createCoverLetter(coverLetter: any) {
    const args = {
      title: coverLetter.title,
      templateId: coverLetter.templateId,
      colorId: coverLetter.colorId,
      data: coverLetter.data,
      userId: coverLetter.userId ?? null,
    };
    const docId = await this.client.mutation("coverLetters:createCoverLetter", args);
    return {
      id: docId,
      userId: args.userId ?? null,
      title: args.title,
      data: args.data,
      templateId: args.templateId,
      colorId: args.colorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async updateCoverLetter(id: string, data: Partial<any>) {
    try {
      const clerkUserId = (data as any)?.userId;
      const args = { id, data, userId: clerkUserId };
      const updated = await this.client.mutation("coverLetters:updateCoverLetter", args);
      if (updated && (updated as any)._id) updated.id = (updated as any)._id;
      return updated;
    } catch (e) {
      const existing = await this.getCoverLetter(id);
      if (!existing) return undefined;
      const merged = { ...existing, ...data, updatedAt: new Date() };
      return merged as any;
    }
  }

  async deleteCoverLetter(id: string, userId?: string) {
    try {
      await this.client.mutation("coverLetters:deleteCoverLetter", { id, userId });
      return true;
    } catch (e) {
      return false;
    }
  }

  // The rest of the interface - keep simple implementations
  async updateUser(id: string, data: any) {
    return this.fallback.updateUser(id, data as any);
  }

  async deleteUser(id: string) {
    return this.fallback.deleteUser ? this.fallback.deleteUser(id) : false;
  }
}

export default ConvexStorage;
