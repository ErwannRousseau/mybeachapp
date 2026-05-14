import type { ValidationError } from "../internal/validation";
import { zodIssuesToValidationErrors } from "../internal/validation";
import {
  ACTIVITY_MAX_PARTICIPANTS,
  ACTIVITY_MIN_PARTICIPANTS,
} from "./constants";
import {
  activityCategorySchema,
  activityStatusSchema,
  createActivityInputSchema,
  latitudeSchema,
  longitudeSchema,
} from "./schemas";
import type {
  ActivityCategory,
  ActivityStatus,
  CreateActivityInput,
} from "./types";

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidLatitude(value: number): boolean {
  return latitudeSchema.safeParse(value).success;
}

export function isValidLongitude(value: number): boolean {
  return longitudeSchema.safeParse(value).success;
}

export function isActivityCategory(value: unknown): value is ActivityCategory {
  return activityCategorySchema.safeParse(value).success;
}

export function isActivityStatus(value: unknown): value is ActivityStatus {
  return activityStatusSchema.safeParse(value).success;
}

export function isValidMaxParticipants(value: number): boolean {
  return (
    Number.isInteger(value) &&
    value >= ACTIVITY_MIN_PARTICIPANTS &&
    value <= ACTIVITY_MAX_PARTICIPANTS
  );
}

export function validateCreateActivityInput(
  input: CreateActivityInput,
): ValidationError[] {
  const result = createActivityInputSchema.safeParse(input);
  return result.success ? [] : zodIssuesToValidationErrors(result.error.issues);
}
