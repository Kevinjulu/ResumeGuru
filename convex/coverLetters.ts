import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCoverLetters = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const subject = identity?.subject ?? args.userId;
    if (!subject) return [];
    return await ctx.db
      .query("coverLetters")
      .withIndex("by_user", (q) => q.eq("userId", subject))
      .order("desc")
      .collect();
  },
});

export const createCoverLetter = mutation({
  args: {
    title: v.string(),
    templateId: v.string(),
    colorId: v.string(),
    data: v.any(),
    // optional `userId` allows server-side callers to pass the Clerk subject
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const subject = identity?.subject ?? args.userId;
    if (!subject) throw new Error("Unauthorized");
    const docId = await ctx.db.insert("coverLetters", {
      userId: subject,
      title: args.title,
      templateId: args.templateId,
      colorId: args.colorId,
      data: args.data,
    });
    return docId;
  },
});

export const deleteCoverLetter = mutation({
  args: { id: v.id("coverLetters"), userId: v.optional(v.string()) },
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

export const updateCoverLetter = mutation({
  args: { id: v.id("coverLetters"), data: v.any(), userId: v.optional(v.string()) },
  handler: async (ctx, { id, data, userId }) => {
    const identity = await ctx.auth.getUserIdentity();
    const subject = identity?.subject ?? userId;
    if (!subject) throw new Error("Unauthorized");

    const doc = await ctx.db.get(id);
    if (!doc) throw new Error("NotFound");
    if (doc.userId !== subject) throw new Error("Forbidden");

    if (typeof (ctx.db as any).patch === "function") {
      await (ctx.db as any).patch(id, data);
    } else if (typeof (ctx.db as any).update === "function") {
      await (ctx.db as any).update(id, data);
    } else {
      throw new Error("Convex update not supported in this runtime");
    }

    return await ctx.db.get(id);
  },
});
