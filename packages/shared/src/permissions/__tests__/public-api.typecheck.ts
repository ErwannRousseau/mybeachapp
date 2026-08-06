import {
  createPermissionChecker,
  type PermissionCheckArguments,
  type PermissionChecker,
} from "../index";

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <
    Value,
  >() => Value extends Right ? 1 : 2
    ? true
    : false;
type Expect<Value extends true> = Value;

const checker: PermissionChecker = createPermissionChecker({
  role: "user",
  userId: "user-1",
});

checker("activity.create");
checker("activity.updateOwn", {
  creatorId: "user-1",
  currentParticipantsCount: 1,
  maxParticipants: 8,
  startDateTime: 200,
});
checker("activity.leaveOwn", { userId: "user-1" });

export type StaticPermissionsRejectContext = Expect<
  Equal<
    PermissionCheckArguments<"activity.create">,
    readonly [permission: "activity.create"]
  >
>;
export type ActivityPermissionsRequireActivityContext = Expect<
  Equal<
    PermissionCheckArguments<"activity.updateOwn">,
    readonly [
      permission: "activity.updateOwn",
      context: {
        readonly creatorId: string;
        readonly currentParticipantsCount: number;
        readonly maxParticipants: number;
        readonly startDateTime: number;
      },
    ]
  >
>;
export type ParticipationPermissionsRequireParticipationContext = Expect<
  Equal<
    PermissionCheckArguments<"activity.leaveOwn">,
    readonly [
      permission: "activity.leaveOwn",
      context: { readonly userId: string },
    ]
  >
>;
