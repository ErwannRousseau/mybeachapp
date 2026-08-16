import { register as registerBetterAuth } from "@convex-dev/better-auth/test";
import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";

import { api } from "../_generated/api";
import schema from "../schema";
import { modules } from "../test.setup";
import {
  addBeachProfile,
  addSignedInUser,
  beachActivityArgs,
} from "./permission.fixtures";

function createTest() {
  const t = convexTest(schema, modules);
  registerBetterAuth(t);
  return t;
}

describe("activity permissions", () => {
  test("rejects activity creation for a disabled profile", async () => {
    // Given
    const t = createTest();
    const now = Date.now();
    const disabled = await addSignedInUser(t, {
      email: "disabled-create@example.com",
      role: "user",
      status: "disabled",
    });

    // When
    const creation = disabled.mutation(
      api.activities.createActivity,
      beachActivityArgs(now + 60_000),
    );

    // Then
    await expect(creation).rejects.toMatchObject({
      data: { code: "forbidden" },
    });
  });

  test("rejects joining a beach activity for a disabled profile", async () => {
    // Given
    const t = createTest();
    const disabled = await addSignedInUser(t, {
      email: "disabled-join@example.com",
      role: "user",
      status: "disabled",
    });
    const activityId = await t.run(async (ctx) => {
      const now = Date.now();
      return await ctx.db.insert("activities", {
        ...beachActivityArgs(now + 60_000),
        createdAt: now,
        creatorId: "organizer",
        currentParticipantsCount: 1,
        status: "open",
        updatedAt: now,
      });
    });

    // When
    const joining = disabled.mutation(api.participations.joinActivity, {
      activityId,
    });

    // Then
    await expect(joining).rejects.toMatchObject({
      data: { code: "forbidden" },
    });
  });
});

describe("admin permissions", () => {
  test("rejects an unauthenticated visitor granting an admin role", async () => {
    // Given
    const t = createTest();

    // When
    const grant = t.mutation(api.admin.grantAdminRole, {
      email: "target@example.com",
    });

    // Then
    await expect(grant).rejects.toMatchObject({
      data: { code: "unauthenticated" },
    });
  });

  test("rejects an ordinary signed-in user granting an admin role", async () => {
    // Given
    const t = createTest();
    const user = await addSignedInUser(t, {
      email: "ordinary@example.com",
      role: "user",
      status: "active",
    });

    // When
    const grant = user.mutation(api.admin.grantAdminRole, {
      email: "target@example.com",
    });

    // Then
    await expect(grant).rejects.toMatchObject({
      data: { code: "forbidden" },
    });
  });

  test("rejects an admin revoking an admin role", async () => {
    // Given
    const t = createTest();
    const admin = await addSignedInUser(t, {
      email: "admin@example.com",
      role: "admin",
      status: "active",
    });

    // When
    const revoke = admin.mutation(api.admin.revokeAdminRole, {
      email: "target@example.com",
    });

    // Then
    await expect(revoke).rejects.toMatchObject({
      data: { code: "forbidden" },
    });
  });

  test("rejects a disabled admin opening the back-office", async () => {
    // Given
    const t = createTest();
    const admin = await addSignedInUser(t, {
      email: "disabled-admin@example.com",
      role: "admin",
      status: "disabled",
    });

    // When
    const viewer = admin.query(api.admin.viewer);

    // Then
    await expect(viewer).rejects.toMatchObject({
      data: { code: "forbidden" },
    });
  });

  test("allows a super admin to grant an admin role", async () => {
    // Given
    const t = createTest();
    const superAdmin = await addSignedInUser(t, {
      email: "grant-super-admin@example.com",
      role: "super_admin",
      status: "active",
    });
    await addBeachProfile(t, {
      email: "grant-target@example.com",
      role: "user",
      status: "active",
    });

    // When
    const profile = await superAdmin.mutation(api.admin.grantAdminRole, {
      email: "grant-target@example.com",
    });

    // Then
    expect(profile.role).toBe("admin");
  });

  test("allows a super admin to revoke an admin role", async () => {
    // Given
    const t = createTest();
    const superAdmin = await addSignedInUser(t, {
      email: "revoke-super-admin@example.com",
      role: "super_admin",
      status: "active",
    });
    await addBeachProfile(t, {
      email: "revoke-target@example.com",
      role: "admin",
      status: "active",
    });

    // When
    const profile = await superAdmin.mutation(api.admin.revokeAdminRole, {
      email: "revoke-target@example.com",
    });

    // Then
    expect(profile.role).toBe("user");
  });

  test("rejects initial super admin seeding when identity email differs", async () => {
    // Given
    const t = convexTest(schema, modules);
    const intruder = t.withIdentity({ email: "intruder@example.com" });

    // When
    const seed = intruder.mutation(api.admin.seedInitialSuperAdmin, {
      email: "erwann.rousseau@icloud.com",
    });

    // Then
    await expect(seed).rejects.toMatchObject({
      data: { code: "unauthorized_email" },
    });
  });
});
