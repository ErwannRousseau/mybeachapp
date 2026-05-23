import { ACTIVITY_CATEGORIES } from "@mybeachapp/shared/activities/constants";
import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { ensureCurrentBeachUser } from "./lib/currentBeachUser";
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
    const user = await ensureCurrentBeachUser(ctx);

    const now = Date.now();

    const activityId = await ctx.db.insert("activities", {
      ...args,
      createdAt: now,
      creatorId: user.userId,
      currentParticipantsCount: 1,
      status: "open",
      updatedAt: now,
    });

    await ctx.db.insert("participations", {
      activityId,
      joinedAt: now,
      status: "joined",
      userId: user.userId,
    });

    return activityId;
  },
});
