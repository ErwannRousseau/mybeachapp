import { v } from "convex/values";

import { query } from "./_generated/server";
import { getCurrentBeachUser } from "./lib/currentBeachUser";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentBeachUser(ctx);
  },
});

export const getUserByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .unique();
  },
});
