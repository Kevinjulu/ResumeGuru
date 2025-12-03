import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCoverLetters = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("coverLetters")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

export const getCoverLetter = query({
  args: { id: v.id("coverLetters") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const createCoverLetter = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    data: v.any(),
    templateId: v.string(),
    colorId: v.string(),
  },
  handler: async (ctx, args) => {
    const coverLetterId = await ctx.db.insert("coverLetters", args);
    return coverLetterId;
  },
});

export const updateCoverLetter = mutation({
  args: {
    id: v.id("coverLetters"),
    title: v.optional(v.string()),
    data: v.optional(v.any()),
    templateId: v.optional(v.string()),
    colorId: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...rest }) => {
    await ctx.db.patch(id, rest);
  },
});

export const deleteCoverLetter = mutation({
  args: { id: v.id("coverLetters") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
