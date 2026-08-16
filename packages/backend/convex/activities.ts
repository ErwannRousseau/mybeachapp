import { GeospatialIndex } from "@convex-dev/geospatial";
import { ACTIVITY_CATEGORIES } from "@mybeachapp/shared/activities/constants";
import type {
  ActivityStatus,
  ActivitySummary,
  ViewportBounds,
} from "@mybeachapp/shared/activities/types";
import { ConvexError, v } from "convex/values";

import { components, internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import { internalMutation, mutation, query } from "./_generated/server";
import { ensureCurrentBeachUser } from "./lib/currentBeachUser";
import { literalUnion } from "./lib/validators";

const MAX_VIEWPORT_SPAN_DEGREES = 5;
const MAX_VIEWPORT_RESULTS = 50;
const activityGeospatialIndex = new GeospatialIndex<
  Id<"activities">,
  { status: ActivityStatus }
>(components.geospatial);

export const getActivityById = query({
  args: { id: v.id("activities") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listOpenByViewport = query({
  args: {
    east: v.number(),
    north: v.number(),
    south: v.number(),
    west: v.number(),
  },
  handler: async (ctx, bounds) => {
    validateViewport(bounds);
    const now = Date.now();
    const rectangles =
      bounds.west <= bounds.east
        ? [bounds]
        : [
            { ...bounds, east: 180 },
            { ...bounds, west: -180 },
          ];
    const pages = await Promise.all(
      rectangles.map((rectangle) =>
        activityGeospatialIndex.query(ctx, {
          filter: (filter) => filter.eq("status", "open"),
          limit: MAX_VIEWPORT_RESULTS,
          shape: { rectangle, type: "rectangle" },
        }),
      ),
    );
    const activityIds = new Set(
      pages.flatMap(({ results }) => results.map(({ key }) => key)),
    );
    const candidates = await Promise.all(
      [...activityIds].map((activityId) => ctx.db.get(activityId)),
    );

    return candidates
      .filter(
        (activity): activity is Doc<"activities"> =>
          activity !== null &&
          activity.status === "open" &&
          activity.startDateTime > now,
      )
      .sort((left, right) => left.startDateTime - right.startDateTime)
      .slice(0, MAX_VIEWPORT_RESULTS)
      .map(toActivitySummary);
  },
});

export const expireActivityDiscovery = internalMutation({
  args: { activityId: v.id("activities") },
  handler: async (ctx, { activityId }) => {
    const activity = await ctx.db.get(activityId);

    if (activity?.status === "open" && activity.startDateTime > Date.now()) {
      return;
    }

    await activityGeospatialIndex.remove(ctx, activityId);
  },
});

export const createActivity = mutation({
  args: {
    addressLabel: v.string(),
    category: literalUnion(ACTIVITY_CATEGORIES),
    description: v.optional(v.string()),
    latitude: v.number(),
    longitude: v.number(),
    maxParticipants: v.number(),
    startDateTime: v.number(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ensureCurrentBeachUser(ctx);

    const now = Date.now();

    const activityId = await ctx.db.insert("activities", {
      ...args,
      createdAt: now,
      creatorId: user.userId,
      currentParticipantsCount: 1,
      status: "open",
      updatedAt: now,
    });

    await ctx.db.insert("participations", {
      activityId,
      joinedAt: now,
      status: "joined",
      userId: user.userId,
    });

    await activityGeospatialIndex.insert(
      ctx,
      activityId,
      { latitude: args.latitude, longitude: args.longitude },
      { status: "open" },
      args.startDateTime,
    );
    await ctx.scheduler.runAt(
      args.startDateTime,
      internal.activities.expireActivityDiscovery,
      { activityId },
    );

    return activityId;
  },
});

function validateViewport(bounds: ViewportBounds) {
  const values = [bounds.north, bounds.south, bounds.east, bounds.west];
  const longitudeSpan =
    bounds.west <= bounds.east
      ? bounds.east - bounds.west
      : 180 - bounds.west + (bounds.east + 180);

  if (
    values.some((value) => !Number.isFinite(value)) ||
    bounds.north > 90 ||
    bounds.south < -90 ||
    bounds.east > 180 ||
    bounds.east < -180 ||
    bounds.west > 180 ||
    bounds.west < -180 ||
    bounds.north <= bounds.south ||
    longitudeSpan <= 0
  ) {
    throw new ConvexError({ code: "viewport_invalid" });
  }

  if (
    bounds.north - bounds.south > MAX_VIEWPORT_SPAN_DEGREES ||
    longitudeSpan > MAX_VIEWPORT_SPAN_DEGREES
  ) {
    throw new ConvexError({ code: "viewport_too_large" });
  }
}

function toActivitySummary(activity: Doc<"activities">): ActivitySummary {
  return {
    category: activity.category,
    currentParticipantsCount: activity.currentParticipantsCount,
    id: activity._id,
    location: {
      addressLabel: activity.addressLabel,
      latitude: activity.latitude,
      longitude: activity.longitude,
      ...(activity.meetingPointDetails === undefined
        ? {}
        : { meetingPointDetails: activity.meetingPointDetails }),
      ...(activity.placeName === undefined
        ? {}
        : { placeName: activity.placeName }),
    },
    maxParticipants: activity.maxParticipants,
    startDateTime: activity.startDateTime,
    status: activity.status,
    title: activity.title,
  };
}
