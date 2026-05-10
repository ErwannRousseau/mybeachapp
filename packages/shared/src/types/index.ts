import type {
  ACTIVITY_CATEGORIES,
  ACTIVITY_STATUSES,
  USER_ROLES,
} from "../constants";

export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];
export type ActivityStatus = (typeof ACTIVITY_STATUSES)[number];
export type UserRole = (typeof USER_ROLES)[number];

export interface ActivityLocation {
  addressLabel: string;
  latitude: number;
  longitude: number;
  meetingPointDetails?: string;
  placeName?: string;
}

export interface ActivitySummary {
  id: string;
  title: string;
  category: ActivityCategory;
  status: ActivityStatus;
  startDateTime: string;
  maxParticipants: number;
  currentParticipantsCount: number;
  location: ActivityLocation;
}
