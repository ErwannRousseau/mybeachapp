import { z } from "zod";

import {
  ACTIVITY_CATEGORIES,
  ACTIVITY_DESCRIPTION_MAX_LENGTH,
  ACTIVITY_MAX_PARTICIPANTS,
  ACTIVITY_MIN_PARTICIPANTS,
  ACTIVITY_STATUSES,
  ACTIVITY_TITLE_MAX_LENGTH,
} from "./constants";

export const activityCategorySchema = z.enum(ACTIVITY_CATEGORIES, {
  error: "category_invalid",
});
export const activityStatusSchema = z.enum(ACTIVITY_STATUSES, {
  error: "status_invalid",
});

export const latitudeSchema = z
  .number({ error: "latitude_invalid" })
  .finite("latitude_invalid")
  .min(-90, "latitude_invalid")
  .max(90, "latitude_invalid");

export const longitudeSchema = z
  .number({ error: "longitude_invalid" })
  .finite("longitude_invalid")
  .min(-180, "longitude_invalid")
  .max(180, "longitude_invalid");

export const activityLocationSchema = z.object({
  addressLabel: z
    .string({ error: "address_required" })
    .trim()
    .min(1, "address_required"),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  meetingPointDetails: z.string().optional(),
  placeName: z.string().optional(),
});

export const createActivityInputSchema = z.object({
  category: activityCategorySchema,
  description: z
    .string()
    .max(ACTIVITY_DESCRIPTION_MAX_LENGTH, "description_too_long")
    .optional(),
  estimatedDurationMinutes: z.number().finite().positive().optional(),
  level: z.string().optional(),
  location: activityLocationSchema,
  maxParticipants: z
    .number({ error: "max_participants_invalid" })
    .int("max_participants_invalid")
    .min(ACTIVITY_MIN_PARTICIPANTS, "max_participants_invalid")
    .max(ACTIVITY_MAX_PARTICIPANTS, "max_participants_invalid"),
  placePhotoStorageId: z.string().optional(),
  startDateTime: z
    .number({ error: "start_invalid" })
    .finite("start_invalid")
    .positive("start_invalid"),
  title: z
    .string({ error: "title_required" })
    .trim()
    .min(1, "title_required")
    .max(ACTIVITY_TITLE_MAX_LENGTH, "title_too_long"),
});
