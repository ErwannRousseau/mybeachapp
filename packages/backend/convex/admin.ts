import { query } from "./_generated/server";

export const getAdminActivities = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("activities").order("desc").take(50);
  }
});
