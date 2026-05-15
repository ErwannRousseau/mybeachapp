import type { Doc } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { authComponent } from "../betterAuth/auth";

type AuthenticatedCtx = QueryCtx | MutationCtx;
type AuthUser = Awaited<ReturnType<typeof authComponent.getAuthUser>>;

type CurrentBeachUser = {
  authUser: AuthUser;
  profile: Doc<"userProfiles"> | null;
  userId: string;
};

async function getBeachUserProfile(ctx: AuthenticatedCtx, userId: string) {
  return await ctx.db
    .query("userProfiles")
    .withIndex("by_user_id", (q) => q.eq("userId", userId))
    .unique();
}

export async function getCurrentBeachUser(ctx: AuthenticatedCtx) {
  const authUser = await authComponent.getAuthUser(ctx);
  const profile = await getBeachUserProfile(ctx, authUser._id);

  return {
    authUser,
    profile,
    userId: authUser._id,
  } satisfies CurrentBeachUser;
}

export async function ensureCurrentBeachUser(ctx: MutationCtx) {
  const user = await getCurrentBeachUser(ctx);

  if (user.profile) {
    return user;
  }

  const now = Date.now();
  const profileId = await ctx.db.insert("userProfiles", {
    createdAt: now,
    email: user.authUser.email,
    lastLoginAt: now,
    role: "user",
    status: "active",
    updatedAt: now,
    userId: user.userId,
  });
  const profile = await ctx.db.get(profileId);

  return {
    ...user,
    profile,
  } satisfies CurrentBeachUser;
}
