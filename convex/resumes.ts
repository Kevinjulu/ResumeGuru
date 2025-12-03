import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getResumes = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("resumes")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

export const getResume = query({
  args: { id: v.id("resumes") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const createResume = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    data: v.any(),
    templateId: v.string(),
    colorId: v.string(),
  },
  handler: async (ctx, args) => {
    const resumeId = await ctx.db.insert("resumes", args);
    return resumeId;
  },
});

export const updateResume = mutation({
  args: {
    id: v.id("resumes"),
    title: v.optional(v.string()),
    data: v.optional(v.any()),
    templateId: v.optional(v.string()),
    colorId: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...rest }) => {
    await ctx.db.patch(id, rest);
  },
});

export const deleteResume = mutation({
  args: { id: v.id("resumes") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
