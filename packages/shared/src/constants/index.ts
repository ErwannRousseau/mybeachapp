export const ACTIVITY_CATEGORIES = [
  "beach_volley",
  "paddle",
  "surf",
  "yoga",
  "running",
  "petanque",
  "swimming",
  "other",
] as const;

export const ACTIVITY_STATUSES = [
  "open",
  "full",
  "cancelled",
  "finished",
] as const;

export const PARTICIPATION_STATUSES = ["joined", "cancelled"] as const;

export const USER_ROLES = ["user", "admin", "super_admin"] as const;

export const USER_STATUSES = ["active", "disabled"] as const;

export const ACTIVITY_MIN_PARTICIPANTS = 2;
export const ACTIVITY_MAX_PARTICIPANTS = 30;
export const ACTIVITY_TITLE_MAX_LENGTH = 80;
export const ACTIVITY_DESCRIPTION_MAX_LENGTH = 500;
