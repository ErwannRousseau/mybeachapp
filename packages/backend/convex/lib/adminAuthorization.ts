import { can } from "@mybeachapp/shared/permissions";
import { ConvexError } from "convex/values";

import type { Doc } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { authComponent } from "../betterAuth/auth";

type AuthenticatedCtx = QueryCtx | MutationCtx;
type AuthUser = Awaited<ReturnType<typeof authComponent.safeGetAuthUser>>;

export type CurrentAdminUser = {
  authUser: NonNullable<AuthUser>;
  profile: Doc<"userProfiles">;
  userId: string;
};

function authError(code: "forbidden" | "unauthenticated") {
  return new ConvexError({ code });
}

async function getCurrentProfile(ctx: AuthenticatedCtx) {
  const authUser = await authComponent.safeGetAuthUser(ctx);

  if (!authUser) {
    throw authError("unauthenticated");
  }

  const profile = await ctx.db
    .query("userProfiles")
    .withIndex("by_user_id", (q) => q.eq("userId", authUser._id))
    .unique();

  return { authUser, profile, userId: authUser._id };
}

async function requireActiveProfile(ctx: AuthenticatedCtx) {
  const user = await getCurrentProfile(ctx);
  const profile = user.profile;

  if (profile?.status !== "active") {
    throw authError("forbidden");
  }

  return { ...user, profile } satisfies CurrentAdminUser;
}

export async function requireAdmin(ctx: AuthenticatedCtx) {
  const user = await requireActiveProfile(ctx);

  if (
    !can(
      { role: user.profile.role, userId: user.userId },
      "adminBackoffice.access",
    )
  ) {
    throw authError("forbidden");
  }

  return user;
}

export async function requireAdminRolePermission(
  ctx: AuthenticatedCtx,
  permission: "adminRole.grant" | "adminRole.revoke",
) {
  const user = await requireActiveProfile(ctx);

  if (!can({ role: user.profile.role, userId: user.userId }, permission)) {
    throw authError("forbidden");
  }

  return user;
}
