import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getResumes = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const subject = identity?.subject ?? args.userId;
    if (!subject) return [];
    return await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", subject))
      .order("desc")
      .collect();
  },
});

export const createResume = mutation({
  args: {
    title: v.string(),
    templateId: v.string(),
    colorId: v.string(),
    data: v.any(),
    // optional `userId` allows server-side callers (who verify Clerk tokens)
    // to pass the Clerk subject when Convex identity isn't available.
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const subject = identity?.subject ?? args.userId;
    if (!subject) throw new Error("Unauthorized");
    const docId = await ctx.db.insert("resumes", {
      userId: subject,
      title: args.title,
      templateId: args.templateId,
      colorId: args.colorId,
      data: args.data,
    });
    return docId;
  },
});

export const deleteResume = mutation({
  args: { id: v.id("resumes"), userId: v.optional(v.string()) },
  handler: async (ctx, { id, userId }) => {
    const identity = await ctx.auth.getUserIdentity();
    const subject = identity?.subject ?? userId;
    if (!subject) throw new Error("Unauthorized");
    const doc = await ctx.db.get(id);
    if (!doc) return;
    if (doc.userId !== subject) throw new Error("Forbidden");
    await ctx.db.delete(id);
  },
});

export const updateResume = mutation({
  args: { id: v.id("resumes"), data: v.any(), userId: v.optional(v.string()) },
  handler: async (ctx, { id, data, userId }) => {
    const identity = await ctx.auth.getUserIdentity();
    const subject = identity?.subject ?? userId;
    if (!subject) throw new Error("Unauthorized");

    const doc = await ctx.db.get(id);
    if (!doc) throw new Error("NotFound");
    if (doc.userId !== subject) throw new Error("Forbidden");

    // Convex doesn't expose a direct `update` helper by id in this codegen,
    // but you can use ctx.db.patch or ctx.db.replace depending on your runtime.
    // Use `patch` if available; otherwise replace the document by deleting and inserting is avoided.
    if (typeof (ctx.db as any).patch === "function") {
      await (ctx.db as any).patch(id, data);
    } else if (typeof (ctx.db as any).update === "function") {
      await (ctx.db as any).update(id, data);
    } else {
      // Fallback: write the updated fields to the document using insert of a new doc is not ideal,
      // so throw to signal the server-side adapter should handle it.
      throw new Error("Convex update not supported in this runtime");
    }

    return await ctx.db.get(id);
  },
});
