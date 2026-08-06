import { createPermix } from "permix";

import type { UserRole } from "../users/types";

export type ActivityPermissionContext = {
  readonly creatorId: string;
  readonly currentParticipantsCount: number;
  readonly maxParticipants: number;
  readonly startDateTime: number;
};

export type ParticipationPermissionContext = {
  readonly userId: string;
};

export type PermissionActor = {
  readonly now?: number;
  readonly role: UserRole;
  readonly userId: string;
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
export type PermissionContextByPath = {
  readonly "activity.cancelOwn": ActivityPermissionContext;
  readonly "activity.leaveOwn": ParticipationPermissionContext;
  readonly "activity.updateOwn": ActivityPermissionContext;
};

export type ContextualPermissionPath = keyof PermissionContextByPath;
export type StaticPermissionPath = Exclude<
  PermissionPath,
  ContextualPermissionPath
>;
export type PermissionCheckArguments<Permission extends PermissionPath> =
  Permission extends ContextualPermissionPath
    ? readonly [
        permission: Permission,
        context: PermissionContextByPath[Permission],
      ]
    : readonly [permission: Permission];
export type PermissionChecker = <Permission extends PermissionPath>(
  ...args: PermissionCheckArguments<Permission>
) => boolean;

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
  context?: unknown,
): boolean {
  return evaluatePermission(actor, permission, context);
}

export function createPermissionChecker(
  actor: PermissionActor,
): PermissionChecker {
  return function check<Permission extends PermissionPath>(
    ...args: PermissionCheckArguments<Permission>
  ): boolean {
    const [permission] = args;
    const context = args.length === 2 ? args[1] : undefined;

    return evaluatePermission(actor, permission, context);
  };
}

function evaluatePermission(
  actor: PermissionActor,
  permission: PermissionPath,
  context: unknown,
): boolean {
  const permix = createPermissions(actor);

  switch (permission) {
    case "activity.cancelOwn":
    case "activity.updateOwn":
      return isActivityPermissionContext(context)
        ? permix.check(permission, context)
        : false;
    case "activity.leaveOwn":
      return isParticipationPermissionContext(context)
        ? permix.check(permission, context)
        : false;
    default:
      return permix.check(permission);
  }
}

function isActivityPermissionContext(
  context: unknown,
): context is ActivityPermissionContext {
  return (
    typeof context === "object" &&
    context !== null &&
    "creatorId" in context &&
    typeof context.creatorId === "string" &&
    "currentParticipantsCount" in context &&
    typeof context.currentParticipantsCount === "number" &&
    Number.isFinite(context.currentParticipantsCount) &&
    "maxParticipants" in context &&
    typeof context.maxParticipants === "number" &&
    Number.isFinite(context.maxParticipants) &&
    "startDateTime" in context &&
    typeof context.startDateTime === "number" &&
    Number.isFinite(context.startDateTime)
  );
}

function isParticipationPermissionContext(
  context: unknown,
): context is ParticipationPermissionContext {
  return (
    typeof context === "object" &&
    context !== null &&
    "userId" in context &&
    typeof context.userId === "string"
  );
}
