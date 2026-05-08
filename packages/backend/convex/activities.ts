import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const getActivityById = query({
  args: { id: v.id("activities") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  }
});

export const createActivity = mutation({
  args: {
    title: v.string(),
    creatorId: v.string(),
    category: v.string(),
    startDateTime: v.number(),
    maxParticipants: v.number(),
    addressLabel: v.string(),
    latitude: v.number(),
    longitude: v.number()
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("activities", {
      ...args,
      category: "other",
      currentParticipantsCount: 1,
      status: "open",
      createdAt: now,
      updatedAt: now
    });
  }
});
