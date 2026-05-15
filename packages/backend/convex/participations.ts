import { v } from "convex/values";

import { mutation } from "./_generated/server";
import { ensureCurrentBeachUser } from "./lib/currentBeachUser";

export const joinActivity = mutation({
  args: {
    activityId: v.id("activities"),
  },
  handler: async (ctx, args) => {
    const user = await ensureCurrentBeachUser(ctx);

    const now = Date.now();

    return await ctx.db.insert("participations", {
      activityId: args.activityId,
      joinedAt: now,
      status: "joined",
      userId: user.userId,
    });
  },
});
