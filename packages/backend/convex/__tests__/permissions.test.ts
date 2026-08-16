import { register as registerBetterAuth } from "@convex-dev/better-auth/test";
import { register as registerGeospatial } from "@convex-dev/geospatial/test";
import type { UserRole, UserStatus } from "@mybeachapp/shared/users/types";
import type { FunctionArgs } from "convex/server";
import { convexTest, type TestConvex } from "convex-test";
import { describe, expect, test } from "vitest";

import { api, components } from "../_generated/api";
import schema from "../schema";

const modules = import.meta.glob("../**/*.ts");
const BEACH_ACTIVITY_CATEGORY = "ball_sport";

function createTest() {
  const t = convexTest(schema, modules);
  registerBetterAuth(t);
  registerGeospatial(t);
  return t;
}

type ProfileFixture = {
  readonly email: string;
  readonly role: UserRole;
  readonly status: UserStatus;
};

async function addSignedInUser(
  t: TestConvex<typeof schema>,
  profile: ProfileFixture,
) {
  const now = Date.now();
  const authUser = await t.mutation(components.betterAuth.adapter.create, {
    input: {
      data: {
        createdAt: now,
        email: profile.email,
        emailVerified: true,
        name: profile.email,
        updatedAt: now,
      },
      model: "user",
    },
  });
  const session = await t.mutation(components.betterAuth.adapter.create, {
    input: {
      data: {
        createdAt: now,
        expiresAt: now + 60_000,
        token: `${profile.email}-session`,
        updatedAt: now,
        userId: authUser._id,
      },
      model: "session",
    },
  });
  await t.run(async (ctx) => {
    await ctx.db.insert("userProfiles", {
      createdAt: now,
      email: profile.email,
      role: profile.role,
      status: profile.status,
      updatedAt: now,
      userId: authUser._id,
    });
  });

  return t.withIdentity({
    email: profile.email,
    sessionId: session._id,
    subject: authUser._id,
  });
}

function beachActivityArgs(
  startDateTime: number,
): FunctionArgs<typeof api.activities.createActivity> {
  return {
    addressLabel: "Plage de Pornichet",
    category: BEACH_ACTIVITY_CATEGORY,
    latitude: 47.264,
    longitude: -2.344,
    maxParticipants: 8,
    startDateTime,
    title: "Volley",
  };
}

async function addBeachProfile(
  t: TestConvex<typeof schema>,
  profile: ProfileFixture,
) {
  return await t.run(async (ctx) => {
    const now = Date.now();
    return await ctx.db.insert("userProfiles", {
      createdAt: now,
      email: profile.email,
      role: profile.role,
      status: profile.status,
      updatedAt: now,
      userId: profile.email,
    });
  });
}

describe("activity permissions", () => {
  test("allows an ordinary active signed-in user to create a beach activity", async () => {
    // Given
    const t = createTest();
    const user = await addSignedInUser(t, {
      email: "active@example.com",
      role: "user",
      status: "active",
    });

    // When
    const activityId = await user.mutation(
      api.activities.createActivity,
      beachActivityArgs(Date.now() + 60_000),
    );

    // Then
    expect(activityId).toBeDefined();
  });

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
    const t = createTest();
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
