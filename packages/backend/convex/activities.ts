import { getAuthUserId } from "@convex-dev/auth/server";
import { ACTIVITY_CATEGORIES } from "@mybeachapp/shared/activities/constants";
import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { literalUnion } from "./lib/validators";

export const getActivityById = query({
  args: { id: v.id("activities") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createActivity = mutation({
  args: {
    addressLabel: v.string(),
    category: literalUnion(ACTIVITY_CATEGORIES),
    description: v.optional(v.string()),
    latitude: v.number(),
    longitude: v.number(),
    maxParticipants: v.number(),
    startDateTime: v.number(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not authenticated");
    }

    const now = Date.now();

    return await ctx.db.insert("activities", {
      ...args,
      createdAt: now,
      creatorId: userId,
      currentParticipantsCount: 1,
      status: "open",
      updatedAt: now,
    });
  },
});
