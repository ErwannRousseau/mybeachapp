import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  activities: defineTable({
    addressLabel: v.string(),
    category: v.union(
      v.literal("beach_volley"),
      v.literal("paddle"),
      v.literal("surf"),
      v.literal("yoga"),
      v.literal("running"),
      v.literal("petanque"),
      v.literal("swimming"),
      v.literal("other"),
    ),
    createdAt: v.number(),
    creatorId: v.string(),
    currentParticipantsCount: v.number(),
    description: v.optional(v.string()),
    estimatedDurationMinutes: v.optional(v.number()),
    latitude: v.number(),
    level: v.optional(v.string()),
    longitude: v.number(),
    maxParticipants: v.number(),
    meetingPointDetails: v.optional(v.string()),
    placeName: v.optional(v.string()),
    placePhotoStorageId: v.optional(v.id("_storage")),
    startDateTime: v.number(),
    status: v.union(
      v.literal("open"),
      v.literal("full"),
      v.literal("cancelled"),
      v.literal("finished"),
    ),
    title: v.string(),
    updatedAt: v.number(),
  })
    .index("by_status_start", ["status", "startDateTime"])
    .index("by_creator", ["creatorId"])
    .index("by_latitude", ["latitude"])
    .index("by_longitude", ["longitude"]),

  participations: defineTable({
    activityId: v.id("activities"),
    cancelledAt: v.optional(v.number()),
    joinedAt: v.number(),
    status: v.union(v.literal("joined"), v.literal("cancelled")),
    userId: v.string(),
  })
    .index("by_activity", ["activityId"])
    .index("by_user", ["userId"])
    .index("by_activity_user", ["activityId", "userId"]),
  users: defineTable({
    avatarStorageId: v.optional(v.id("_storage")),
    createdAt: v.number(),
    email: v.optional(v.string()),
    lastLoginAt: v.optional(v.number()),
    pseudo: v.optional(v.string()),
    role: v.union(
      v.literal("user"),
      v.literal("admin"),
      v.literal("super_admin"),
    ),
    status: v.union(v.literal("active"), v.literal("disabled")),
    updatedAt: v.number(),
    userId: v.string(),
  })
    .index("by_user_id", ["userId"])
    .index("by_role", ["role"]),
});
