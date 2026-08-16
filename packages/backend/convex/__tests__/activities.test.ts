import { register as registerBetterAuth } from "@convex-dev/better-auth/test";
import { register as registerGeospatial } from "@convex-dev/geospatial/test";
import type { ActivityStatus } from "@mybeachapp/shared/activities/types";
import { convexTest, type TestConvex } from "convex-test";
import { describe, expect, test } from "vitest";

import { api, components, internal } from "../_generated/api";
import schema from "../schema";
import { addSignedInUser, beachActivityArgs } from "./permission.fixtures";

const modules = import.meta.glob([
  "../**/*.{ts,tsx,js}",
  "!../**/__tests__/**",
  "!../**/*.config.ts",
]);

type ActivityFixture = {
  latitude?: number;
  longitude?: number;
  startDateTime?: number;
  status?: ActivityStatus;
  title?: string;
};

async function addActivity(
  t: TestConvex<typeof schema>,
  fixture: ActivityFixture = {},
) {
  return await t.run(async (ctx) => {
    const now = Date.now();

    const activityId = await ctx.db.insert("activities", {
      addressLabel: "Plage de Bonne-Source",
      category: "ball_sport",
      createdAt: now,
      creatorId: "organizer@example.com",
      currentParticipantsCount: 2,
      latitude: fixture.latitude ?? 47.266,
      longitude: fixture.longitude ?? -2.344,
      maxParticipants: 8,
      placeName: "Pornichet",
      startDateTime: fixture.startDateTime ?? now + 3_600_000,
      status: fixture.status ?? "open",
      title: fixture.title ?? "Beach-volley",
      updatedAt: now,
    });

    await ctx.runMutation(components.geospatial.document.insert, {
      document: {
        coordinates: {
          latitude: fixture.latitude ?? 47.266,
          longitude: fixture.longitude ?? -2.344,
        },
        filterKeys: { status: fixture.status ?? "open" },
        key: activityId,
        sortKey: fixture.startDateTime ?? now + 3_600_000,
      },
      levelMod: 2,
      maxCells: 8,
      maxLevel: 16,
      minLevel: 4,
    });

    return activityId;
  });
}

function createTest() {
  const t = convexTest(schema, modules);
  registerGeospatial(t);
  return t;
}

function createAuthenticatedTest() {
  const t = createTest();
  registerBetterAuth(t);
  return t;
}

const PILOT_VIEWPORT = {
  east: -2.3,
  north: 47.35,
  south: 47.2,
  west: -2.5,
};

describe("open Beach Activity viewport discovery", () => {
  test("returns future open activities as the shared summary contract", async () => {
    const t = createTest();
    const visibleId = await addActivity(t);
    await addActivity(t, { status: "cancelled", title: "Cancelled" });
    await addActivity(t, {
      startDateTime: Date.now() - 60_000,
      title: "Past",
    });
    await addActivity(t, { longitude: -1.5, title: "Outside" });

    const activities = await t.query(
      api.activities.listOpenByViewport,
      PILOT_VIEWPORT,
    );

    expect(activities).toEqual([
      {
        category: "ball_sport",
        currentParticipantsCount: 2,
        id: visibleId,
        location: {
          addressLabel: "Plage de Bonne-Source",
          latitude: 47.266,
          longitude: -2.344,
          placeName: "Pornichet",
        },
        maxParticipants: 8,
        startDateTime: expect.any(Number),
        status: "open",
        title: "Beach-volley",
      },
    ]);
  });

  test("rejects invalid and unbounded viewports", async () => {
    const t = createTest();

    await expect(
      t.query(api.activities.listOpenByViewport, {
        ...PILOT_VIEWPORT,
        north: 47.1,
      }),
    ).rejects.toMatchObject({ data: { code: "viewport_invalid" } });

    await expect(
      t.query(api.activities.listOpenByViewport, {
        east: 10,
        north: 50,
        south: 40,
        west: 0,
      }),
    ).rejects.toMatchObject({ data: { code: "viewport_too_large" } });
  });

  test("supports a bounded viewport crossing the antimeridian", async () => {
    const t = createTest();
    const eastId = await addActivity(t, {
      latitude: 0,
      longitude: 179.5,
      title: "East",
    });
    const westId = await addActivity(t, {
      latitude: 0,
      longitude: -179.5,
      title: "West",
    });
    await addActivity(t, { latitude: 0, longitude: 0, title: "Outside" });

    const activities = await t.query(api.activities.listOpenByViewport, {
      east: -179,
      north: 1,
      south: -1,
      west: 179,
    });

    expect(activities.map(({ id }) => id)).toEqual([eastId, westId]);
  });

  test("caps every viewport response", async () => {
    const t = createTest();

    for (let index = 0; index < 55; index++) {
      await addActivity(t, {
        latitude: 47.25 + index * 0.0001,
        title: `Activity ${index}`,
      });
    }

    const activities = await t.query(
      api.activities.listOpenByViewport,
      PILOT_VIEWPORT,
    );

    expect(activities).toHaveLength(50);
  });

  test("does not hide matches behind longitude-filtered index rows", async () => {
    const t = createTest();

    for (let index = 0; index < 250; index++) {
      await addActivity(t, {
        latitude: 47.21 + index * 0.0001,
        longitude: -1.5,
        title: `Outside ${index}`,
      });
    }
    const visibleId = await addActivity(t, {
      latitude: 47.34,
      title: "Visible after filtered rows",
    });

    const activities = await t.query(
      api.activities.listOpenByViewport,
      PILOT_VIEWPORT,
    );

    expect(activities.map(({ id }) => id)).toEqual([visibleId]);
  });

  test("removes expired index entries before they can displace future activities", async () => {
    const t = createTest();

    for (let index = 0; index < 55; index++) {
      const activityId = await addActivity(t, {
        startDateTime: Date.now() - 60_000,
        title: `Past ${index}`,
      });
      await t.mutation(internal.activities.expireActivityDiscovery, {
        activityId,
      });
    }
    const visibleId = await addActivity(t, { title: "Future" });

    const activities = await t.query(
      api.activities.listOpenByViewport,
      PILOT_VIEWPORT,
    );

    expect(activities.map(({ id }) => id)).toEqual([visibleId]);
  });
});

describe("activity permissions", () => {
  test("allows an ordinary active signed-in user to create a beach activity", async () => {
    // Given
    const t = createAuthenticatedTest();
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
});
