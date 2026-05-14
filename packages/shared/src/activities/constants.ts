export const ACTIVITY_CATEGORIES = [
  "ball_sport",
  "water_sport",
  "racket_sport",
  "fitness_wellness",
  "walking_running",
  "beach_games",
  "social",
  "other",
] as const;

export const ACTIVITY_STATUSES = [
  "open",
  "full",
  "cancelled",
  "finished",
] as const;

export const ACTIVITY_MIN_PARTICIPANTS = 2;
export const ACTIVITY_MAX_PARTICIPANTS = 30;
export const ACTIVITY_TITLE_MAX_LENGTH = 80;
export const ACTIVITY_DESCRIPTION_MAX_LENGTH = 500;
