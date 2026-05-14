import { userRoleSchema, userStatusSchema } from "./schemas";
import type { UserRole, UserStatus } from "./types";

export function isUserRole(value: unknown): value is UserRole {
  return userRoleSchema.safeParse(value).success;
}

export function isUserStatus(value: unknown): value is UserStatus {
  return userStatusSchema.safeParse(value).success;
}
