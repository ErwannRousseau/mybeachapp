import { authTables } from "@convex-dev/auth/server";
import {
  ACTIVITY_CATEGORIES,
  ACTIVITY_STATUSES,
} from "@mybeachapp/shared/activities/constants";
import { PARTICIPATION_STATUSES } from "@mybeachapp/shared/participations/constants";
import { USER_ROLES, USER_STATUSES } from "@mybeachapp/shared/users/constants";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

import { literalUnion } from "./lib/validators";

export default defineSchema({
  ...authTables,

  activities: defineTable({
    addressLabel: v.string(),
    category: literalUnion(ACTIVITY_CATEGORIES),
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
    status: literalUnion(ACTIVITY_STATUSES),
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
    status: literalUnion(PARTICIPATION_STATUSES),
    userId: v.string(),
  })
    .index("by_activity", ["activityId"])
    .index("by_user", ["userId"])
    .index("by_activity_user", ["activityId", "userId"]),

  userProfiles: defineTable({
    avatarStorageId: v.optional(v.id("_storage")),
    createdAt: v.number(),
    email: v.optional(v.string()),
    lastLoginAt: v.optional(v.number()),
    pseudo: v.optional(v.string()),
    role: literalUnion(USER_ROLES),
    status: literalUnion(USER_STATUSES),
    updatedAt: v.number(),
    userId: v.string(),
  })
    .index("by_user_id", ["userId"])
    .index("by_role", ["role"]),
});
