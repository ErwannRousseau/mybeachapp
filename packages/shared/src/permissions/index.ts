import { createPermix } from "permix";

import type { UserRole } from "../users/types";

export type ActivityPermissionContext = {
  creatorId: string;
  currentParticipantsCount: number;
  maxParticipants: number;
  startDateTime: number;
};

export type ParticipationPermissionContext = {
  userId: string;
};

export type PermissionActor = {
  now?: number;
  role: UserRole;
  userId: string;
};

export type PermissionDefinition = {
  adminBackoffice: ["access"];
  adminActivity: ["read"];
  adminRole: ["grant", "revoke"];
  activity: [
    "create",
    "join",
    { name: "updateOwn"; required: true; type: ActivityPermissionContext },
    { name: "cancelOwn"; required: true; type: ActivityPermissionContext },
    { name: "leaveOwn"; required: true; type: ParticipationPermissionContext },
  ];
};

export const PERMISSION_PATHS = [
  "adminBackoffice.access",
  "adminActivity.read",
  "adminRole.grant",
  "adminRole.revoke",
  "activity.create",
  "activity.join",
  "activity.updateOwn",
  "activity.cancelOwn",
  "activity.leaveOwn",
] as const;

export type PermissionPath = (typeof PERMISSION_PATHS)[number];
type StaticPermissionPath = Exclude<
  PermissionPath,
  "activity.cancelOwn" | "activity.leaveOwn" | "activity.updateOwn"
>;

export function createPermissions(actor: PermissionActor) {
  const isAdmin = actor.role === "admin" || actor.role === "super_admin";
  const isSuperAdmin = actor.role === "super_admin";
  const now = actor.now ?? Date.now();
  const permix = createPermix<PermissionDefinition>();

  permix.setup({
    activity: {
      cancelOwn: (activity) =>
        activity.creatorId === actor.userId && activity.startDateTime > now,
      create: true,
      join: true,
      leaveOwn: (participation) => participation.userId === actor.userId,
      updateOwn: (activity) =>
        activity.creatorId === actor.userId && activity.startDateTime > now,
    },
    adminActivity: {
      read: isAdmin,
    },
    adminBackoffice: {
      access: isAdmin,
    },
    adminRole: {
      grant: isSuperAdmin,
      revoke: isSuperAdmin,
    },
  });

  return permix;
}

export function can(
  actor: PermissionActor,
  permission: "activity.cancelOwn" | "activity.updateOwn",
  context: ActivityPermissionContext,
): boolean;
export function can(
  actor: PermissionActor,
  permission: "activity.leaveOwn",
  context: ParticipationPermissionContext,
): boolean;
export function can(
  actor: PermissionActor,
  permission: StaticPermissionPath,
): boolean;
export function can(
  actor: PermissionActor,
  permission: PermissionPath,
  context?: ActivityPermissionContext | ParticipationPermissionContext,
) {
  const permix = createPermissions(actor);

  if (
    permission === "activity.cancelOwn" ||
    permission === "activity.updateOwn"
  ) {
    return context
      ? permix.check(permission, context as ActivityPermissionContext)
      : false;
  }

  if (permission === "activity.leaveOwn") {
    return context
      ? permix.check(permission, context as ParticipationPermissionContext)
      : false;
  }

  return permix.check(permission);
}
