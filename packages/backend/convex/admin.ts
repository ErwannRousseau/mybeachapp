import { ConvexError, v } from "convex/values";

import type { Doc } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { env } from "./config/env";
import {
  requireAdmin,
  requireAdminRolePermission,
} from "./lib/adminAuthorization";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function adminError(
  code: "conflict" | "forbidden" | "not_found" | "unauthorized_email",
) {
  return new ConvexError({ code });
}

type AdminCtx = MutationCtx | QueryCtx;

async function getUniqueProfileByEmail(ctx: AdminCtx, email: string) {
  const profiles = await ctx.db
    .query("userProfiles")
    .withIndex("by_email", (q) => q.eq("email", normalizeEmail(email)))
    .take(2);
  const [profile] = profiles;

  if (!profile) {
    throw adminError("not_found");
  }

  if (profiles.length > 1) {
    throw adminError("conflict");
  }

  return profile;
}

async function patchRole(
  ctx: MutationCtx,
  profile: Doc<"userProfiles">,
  role: "admin" | "super_admin" | "user",
) {
  if (profile.role === role) {
    return profile;
  }

  const updatedAt = Date.now();
  await ctx.db.patch(profile._id, {
    role,
    updatedAt,
  });

  return { ...profile, role, updatedAt };
}

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAdmin(ctx);

    return user.profile;
  },
});

export const getAdminActivities = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    return await ctx.db.query("activities").order("desc").take(50);
  },
});

export const grantAdminRole = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const currentUser = await requireAdminRolePermission(
      ctx,
      "adminRole.grant",
    );
    const profile = await getUniqueProfileByEmail(ctx, args.email);

    if (profile.userId === currentUser.userId || profile.status !== "active") {
      throw adminError("forbidden");
    }

    if (profile.role === "super_admin") {
      return profile;
    }

    return await patchRole(ctx, profile, "admin");
  },
});

export const revokeAdminRole = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const currentUser = await requireAdminRolePermission(
      ctx,
      "adminRole.revoke",
    );
    const profile = await getUniqueProfileByEmail(ctx, args.email);

    if (
      profile.userId === currentUser.userId ||
      profile.role === "super_admin"
    ) {
      throw adminError("forbidden");
    }

    return await patchRole(ctx, profile, "user");
  },
});

export const seedInitialSuperAdmin = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    const identity = await ctx.auth.getUserIdentity();
    const identityEmail = identity?.email
      ? normalizeEmail(identity.email)
      : undefined;

    if (
      identityEmail !== email ||
      !env.INITIAL_SUPER_ADMIN_EMAILS.includes(email)
    ) {
      throw adminError("unauthorized_email");
    }

    const profile = await getUniqueProfileByEmail(ctx, email);

    if (profile.status !== "active") {
      throw adminError("forbidden");
    }

    return await patchRole(ctx, profile, "super_admin");
  },
});
