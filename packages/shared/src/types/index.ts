import type {
  ACTIVITY_CATEGORIES,
  ACTIVITY_STATUSES,
  PARTICIPATION_STATUSES,
  USER_ROLES,
  USER_STATUSES,
} from "../constants";

export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];
export type ActivityStatus = (typeof ACTIVITY_STATUSES)[number];
export type ParticipationStatus = (typeof PARTICIPATION_STATUSES)[number];
export type UserRole = (typeof USER_ROLES)[number];
export type UserStatus = (typeof USER_STATUSES)[number];

export interface ActivityLocation {
  addressLabel: string;
  latitude: number;
  longitude: number;
  meetingPointDetails?: string;
  placeName?: string;
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  category: ActivityCategory;
  status: ActivityStatus;
  level?: string;
  startDateTime: number;
  estimatedDurationMinutes?: number;
  maxParticipants: number;
  currentParticipantsCount: number;
  creatorId: string;
  location: ActivityLocation;
  placePhotoStorageId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ActivitySummary {
  id: string;
  title: string;
  category: ActivityCategory;
  status: ActivityStatus;
  startDateTime: number;
  maxParticipants: number;
  currentParticipantsCount: number;
  location: ActivityLocation;
}

export interface Participation {
  id: string;
  activityId: string;
  userId: string;
  status: ParticipationStatus;
  joinedAt: number;
  cancelledAt?: number;
}

export interface Profile {
  id: string;
  userId: string;
  pseudo?: string;
  email?: string;
  avatarStorageId?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: number;
  updatedAt: number;
  lastLoginAt?: number;
}

export interface CreateActivityInput {
  title: string;
  description?: string;
  category: ActivityCategory;
  level?: string;
  startDateTime: number;
  estimatedDurationMinutes?: number;
  maxParticipants: number;
  location: ActivityLocation;
  placePhotoStorageId?: string;
}

export interface JoinActivityInput {
  activityId: string;
  userId: string;
}
