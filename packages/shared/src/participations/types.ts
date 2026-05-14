import type { PARTICIPATION_STATUSES } from "./constants";

export type ParticipationStatus = (typeof PARTICIPATION_STATUSES)[number];

export interface Participation {
  id: string;
  activityId: string;
  userId: string;
  status: ParticipationStatus;
  joinedAt: number;
  cancelledAt?: number;
}

export interface JoinActivityInput {
  activityId: string;
  userId: string;
}
