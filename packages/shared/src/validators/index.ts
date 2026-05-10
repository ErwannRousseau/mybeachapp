import {
  ACTIVITY_CATEGORIES,
  ACTIVITY_DESCRIPTION_MAX_LENGTH,
  ACTIVITY_MAX_PARTICIPANTS,
  ACTIVITY_MIN_PARTICIPANTS,
  ACTIVITY_STATUSES,
  ACTIVITY_TITLE_MAX_LENGTH,
  PARTICIPATION_STATUSES,
  USER_ROLES,
  USER_STATUSES,
} from "../constants";
import type {
  ActivityCategory,
  ActivityStatus,
  CreateActivityInput,
  ParticipationStatus,
  UserRole,
  UserStatus,
} from "../types";

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidLatitude(value: number): boolean {
  return Number.isFinite(value) && value >= -90 && value <= 90;
}

export function isValidLongitude(value: number): boolean {
  return Number.isFinite(value) && value >= -180 && value <= 180;
}

export function isActivityCategory(value: unknown): value is ActivityCategory {
  return (
    typeof value === "string" &&
    (ACTIVITY_CATEGORIES as readonly string[]).includes(value)
  );
}

export function isActivityStatus(value: unknown): value is ActivityStatus {
  return (
    typeof value === "string" &&
    (ACTIVITY_STATUSES as readonly string[]).includes(value)
  );
}

export function isParticipationStatus(
  value: unknown,
): value is ParticipationStatus {
  return (
    typeof value === "string" &&
    (PARTICIPATION_STATUSES as readonly string[]).includes(value)
  );
}

export function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === "string" &&
    (USER_ROLES as readonly string[]).includes(value)
  );
}

export function isUserStatus(value: unknown): value is UserStatus {
  return (
    typeof value === "string" &&
    (USER_STATUSES as readonly string[]).includes(value)
  );
}

export function isValidMaxParticipants(value: number): boolean {
  return (
    Number.isInteger(value) &&
    value >= ACTIVITY_MIN_PARTICIPANTS &&
    value <= ACTIVITY_MAX_PARTICIPANTS
  );
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateCreateActivityInput(
  input: CreateActivityInput,
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!isNonEmptyString(input.title)) {
    errors.push({ field: "title", message: "title_required" });
  } else if (input.title.length > ACTIVITY_TITLE_MAX_LENGTH) {
    errors.push({ field: "title", message: "title_too_long" });
  }

  if (
    input.description !== undefined &&
    input.description.length > ACTIVITY_DESCRIPTION_MAX_LENGTH
  ) {
    errors.push({ field: "description", message: "description_too_long" });
  }

  if (!isActivityCategory(input.category)) {
    errors.push({ field: "category", message: "category_invalid" });
  }

  if (!Number.isFinite(input.startDateTime) || input.startDateTime <= 0) {
    errors.push({ field: "startDateTime", message: "start_invalid" });
  }

  if (!isValidMaxParticipants(input.maxParticipants)) {
    errors.push({
      field: "maxParticipants",
      message: "max_participants_invalid",
    });
  }

  if (!isNonEmptyString(input.location?.addressLabel)) {
    errors.push({
      field: "location.addressLabel",
      message: "address_required",
    });
  }
  if (!isValidLatitude(input.location?.latitude)) {
    errors.push({ field: "location.latitude", message: "latitude_invalid" });
  }
  if (!isValidLongitude(input.location?.longitude)) {
    errors.push({ field: "location.longitude", message: "longitude_invalid" });
  }

  return errors;
}
