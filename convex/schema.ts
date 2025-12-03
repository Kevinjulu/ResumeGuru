import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
  resumes: defineTable({
    userId: v.id("users"),
    title: v.string(),
    data: v.any(),
    templateId: v.string(),
    colorId: v.string(),
  }),
  coverLetters: defineTable({
    userId: v.id("users"),
    title: v.string(),
    data: v.any(),
    templateId: v.string(),
    colorId: v.string(),
  }),
  subscriptions: defineTable({
    userId: v.id("users"),
    tier: v.string(),
    status: v.string(),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    renewalDate: v.number(),
  }),
  payments: defineTable({
    userId: v.id("users"),
    tier: v.string(),
    amount: v.number(),
    currency: v.string(),
    provider: v.string(),
    providerOrderId: v.string(),
    providerCaptureId: v.string(),
    receiptEncrypted: v.string(),
  }),
  files: defineTable({
    name: v.string(),
    storageId: v.string(),
  }),
});
