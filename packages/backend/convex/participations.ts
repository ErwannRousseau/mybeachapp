import { v } from "convex/values";

import { mutation } from "./_generated/server";

export const joinActivity = mutation({
  args: {
    activityId: v.id("activities"),
    userId: v.string()
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("participations", {
      activityId: args.activityId,
      userId: args.userId,
      status: "joined",
      joinedAt: now
    });
  }
});
