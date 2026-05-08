import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.optional(v.string()),
    pseudo: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
    role: v.union(v.literal("user"), v.literal("admin"), v.literal("super_admin")),
    status: v.union(v.literal("active"), v.literal("disabled")),
    createdAt: v.number(),
    updatedAt: v.number(),
    lastLoginAt: v.optional(v.number())
  })
    .index("by_user_id", ["userId"])
    .index("by_role", ["role"]),

  activities: defineTable({
    creatorId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    category: v.union(
      v.literal("beach_volley"),
      v.literal("paddle"),
      v.literal("surf"),
      v.literal("yoga"),
      v.literal("running"),
      v.literal("petanque"),
      v.literal("swimming"),
      v.literal("other")
    ),
    level: v.optional(v.string()),
    startDateTime: v.number(),
    estimatedDurationMinutes: v.optional(v.number()),
    maxParticipants: v.number(),
    currentParticipantsCount: v.number(),
    status: v.union(
      v.literal("open"),
      v.literal("full"),
      v.literal("cancelled"),
      v.literal("finished")
    ),
    addressLabel: v.string(),
    placeName: v.optional(v.string()),
    latitude: v.number(),
    longitude: v.number(),
    meetingPointDetails: v.optional(v.string()),
    placePhotoStorageId: v.optional(v.id("_storage")),
    createdAt: v.number(),
    updatedAt: v.number()
  })
    .index("by_status_start", ["status", "startDateTime"])
    .index("by_creator", ["creatorId"])
    .index("by_latitude", ["latitude"])
    .index("by_longitude", ["longitude"]),

  participations: defineTable({
    activityId: v.id("activities"),
    userId: v.string(),
    status: v.union(v.literal("joined"), v.literal("cancelled")),
    joinedAt: v.number(),
    cancelledAt: v.optional(v.number())
  })
    .index("by_activity", ["activityId"])
    .index("by_user", ["userId"])
    .index("by_activity_user", ["activityId", "userId"])
});
