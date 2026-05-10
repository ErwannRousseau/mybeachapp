import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const getActivityById = query({
  args: { id: v.id("activities") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createActivity = mutation({
  args: {
    addressLabel: v.string(),
    category: v.string(),
    creatorId: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    maxParticipants: v.number(),
    startDateTime: v.number(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("activities", {
      ...args,
      category: "other",
      createdAt: now,
      currentParticipantsCount: 1,
      status: "open",
      updatedAt: now,
    });
  },
});
