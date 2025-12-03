import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    // Clerk user identifier (subject)
    userId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
  }).index("by_userId", ["userId"]),

  resumes: defineTable({
    userId: v.string(),
    title: v.string(),
    templateId: v.string(),
    colorId: v.string(),
    data: v.any(),
  })
    .index("by_user", ["userId"])
    ,

  coverLetters: defineTable({
    userId: v.string(),
    title: v.string(),
    templateId: v.string(),
    colorId: v.string(),
    data: v.any(),
  })
    .index("by_user", ["userId"])
    ,
});

