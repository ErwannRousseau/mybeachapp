import type { ACTIVITY_CATEGORIES, ACTIVITY_STATUSES } from "./constants";

export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];
export type ActivityStatus = (typeof ACTIVITY_STATUSES)[number];

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

export interface ViewportBounds {
  east: number;
  north: number;
  south: number;
  west: number;
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
