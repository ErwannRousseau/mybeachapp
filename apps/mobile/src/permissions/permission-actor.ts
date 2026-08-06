import type { PermissionActor } from "@mybeachapp/shared/permissions";
import type { UserRole, UserStatus } from "@mybeachapp/shared/users/types";

import type { CurrentSignedInUser } from "@/src/auth/email-otp-capability";

type ProfilePermissionFields = {
  readonly role: UserRole;
  readonly status: UserStatus;
};

export function getPermissionActor(
  currentUser: CurrentSignedInUser | null,
  profile: ProfilePermissionFields | null | undefined,
): PermissionActor | null {
  if (!currentUser || profile === undefined || profile?.status === "disabled") {
    return null;
  }

  return {
    role: profile?.role ?? "user",
    userId: currentUser.id,
  };
}
