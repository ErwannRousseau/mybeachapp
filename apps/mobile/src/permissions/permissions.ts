import { api } from "@mybeachapp/backend/convex/_generated/api";
import {
  createPermissionChecker,
  type PermissionCheckArguments,
  type PermissionChecker,
  type PermissionPath,
} from "@mybeachapp/shared/permissions";
import { useQuery } from "convex/react";

import { useAuthSession } from "@/src/auth/session";

import { getPermissionActor } from "./permission-actor";

export function usePermissions() {
  const session = useAuthSession();
  const currentUserProfile = useQuery(
    api.users.getCurrentUser,
    session.data ? {} : "skip",
  );
  const actor = getPermissionActor(
    session.data,
    currentUserProfile === undefined ? undefined : currentUserProfile.profile,
  );
  const can: PermissionChecker = actor
    ? createPermissionChecker(actor)
    : denyPermissions;

  return {
    can,
    currentUser: session.data,
    isPending:
      session.isPending || (Boolean(session.data) && !currentUserProfile),
  };
}

function denyPermissions<Permission extends PermissionPath>(
  ..._args: PermissionCheckArguments<Permission>
): boolean {
  return false;
}
