import type { USER_ROLES, USER_STATUSES } from "./constants";

export type UserRole = (typeof USER_ROLES)[number];
export type UserStatus = (typeof USER_STATUSES)[number];

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
