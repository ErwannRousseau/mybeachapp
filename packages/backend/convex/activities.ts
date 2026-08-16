import { ACTIVITY_CATEGORIES } from "@mybeachapp/shared/activities/constants";
import type { ActivitySummary } from "@mybeachapp/shared/activities/types";
import { ConvexError, v } from "convex/values";

import type { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { ensureCurrentBeachUser } from "./lib/currentBeachUser";
import { literalUnion } from "./lib/validators";

const MAX_VIEWPORT_SPAN_DEGREES = 5;
const MAX_VIEWPORT_RESULTS = 50;

type ViewportBounds = {
  east: number;
  north: number;
  south: number;
  west: number;
};

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

    const candidates = await ctx.db
      .query("activities")
      .withIndex("by_status_and_latitude", (index) =>
        index
          .eq("status", "open")
          .gte("latitude", bounds.south)
          .lte("latitude", bounds.north),
      )
      .filter((filter) =>
        filter.and(
          filter.gt(filter.field("startDateTime"), now),
          bounds.west <= bounds.east
            ? filter.and(
                filter.gte(filter.field("longitude"), bounds.west),
                filter.lte(filter.field("longitude"), bounds.east),
              )
            : filter.or(
                filter.gte(filter.field("longitude"), bounds.west),
                filter.lte(filter.field("longitude"), bounds.east),
              ),
        ),
      )
      .take(MAX_VIEWPORT_RESULTS);

    return candidates
      .sort((left, right) => left.startDateTime - right.startDateTime)
      .map(toActivitySummary);
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
