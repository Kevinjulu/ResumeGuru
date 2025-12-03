import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createFile = mutation({
  args: {
    name: v.string(),
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("files", {
      name: args.name,
      storageId: args.storageId,
    });
  },
});

export const getFiles = query({
  args: {},
  handler: async (ctx, args) => {
    return await ctx.db.query("files").collect();
  },
});
