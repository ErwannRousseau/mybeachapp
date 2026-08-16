import type { UserRole, UserStatus } from "@mybeachapp/shared/users/types";
import type { FunctionArgs } from "convex/server";
import type { TestConvex } from "convex-test";

import { type api, components } from "../_generated/api";
import type schema from "../schema";

type ProfileFixture = {
  readonly email: string;
  readonly role: UserRole;
  readonly status: UserStatus;
};

export async function addSignedInUser(
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
  await insertProfile(t, profile, authUser._id);

  return t.withIdentity({
    email: profile.email,
    sessionId: session._id,
    subject: authUser._id,
  });
}

export async function addBeachProfile(
  t: TestConvex<typeof schema>,
  profile: ProfileFixture,
) {
  return await insertProfile(t, profile, profile.email);
}

export function beachActivityArgs(
  startDateTime: number,
): FunctionArgs<typeof api.activities.createActivity> {
  return {
    addressLabel: "Plage de Pornichet",
    category: "ball_sport",
    latitude: 47.264,
    longitude: -2.344,
    maxParticipants: 8,
    startDateTime,
    title: "Volley",
  };
}

async function insertProfile(
  t: TestConvex<typeof schema>,
  profile: ProfileFixture,
  userId: string,
) {
  return await t.run(async (ctx) => {
    const now = Date.now();
    return await ctx.db.insert("userProfiles", {
      createdAt: now,
      email: profile.email,
      role: profile.role,
      status: profile.status,
      updatedAt: now,
      userId,
    });
  });
}
