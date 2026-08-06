import type { PermissionChecker } from "@mybeachapp/shared/permissions";

import type { usePermissions } from "../permissions";

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <
    Value,
  >() => Value extends Right ? 1 : 2
    ? true
    : false;
type Expect<Value extends true> = Value;

export type UsePermissionsKeepsTheSharedPermissionChecker = Expect<
  Equal<ReturnType<typeof usePermissions>["can"], PermissionChecker>
>;
