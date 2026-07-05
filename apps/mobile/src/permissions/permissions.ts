import { api } from "@mybeachapp/backend/convex/_generated/api";
import {
  type ActivityPermissionContext,
  can,
  type ParticipationPermissionContext,
  type PermissionActor,
  type PermissionPath,
} from "@mybeachapp/shared/permissions";
import { useQuery } from "convex/react";

import { useAuthSession } from "@/src/auth/session";

import { getPermissionActor } from "./permission-actor";

type PermissionContext =
  | ActivityPermissionContext
  | ParticipationPermissionContext;

export function usePermissions() {
  const session = useAuthSession();
  const currentUserProfile = useQuery(
    api.users.getCurrentUser,
    session.data ? {} : "skip",
  );
  const actor = getPermissionActor(
    session.data,
    currentUserProfile?.profile ?? null,
  );

  return {
    can: (permission: PermissionPath, context?: PermissionContext) =>
      actor ? canWithOptionalContext(actor, permission, context) : false,
    currentUser: session.data,
    isPending:
      session.isPending || (Boolean(session.data) && !currentUserProfile),
  };
}

function canWithOptionalContext(
  actor: PermissionActor,
  permission: PermissionPath,
  context?: PermissionContext,
) {
  if (
    permission === "activity.cancelOwn" ||
    permission === "activity.updateOwn"
  ) {
    return context
      ? can(actor, permission, context as ActivityPermissionContext)
      : false;
  }

  if (permission === "activity.leaveOwn") {
    return context
      ? can(actor, permission, context as ParticipationPermissionContext)
      : false;
  }

  return can(actor, permission);
}
