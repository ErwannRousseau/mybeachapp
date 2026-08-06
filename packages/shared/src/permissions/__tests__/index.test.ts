import { describe, expect, test } from "vitest";

import { can, createPermissionChecker } from "../index";

describe("permissions", () => {
  test("maps admin roles to back-office permissions", () => {
    expect(
      can({ role: "user", userId: "user" }, "adminBackoffice.access"),
    ).toBe(false);
    expect(
      can({ role: "admin", userId: "admin" }, "adminBackoffice.access"),
    ).toBe(true);
    expect(can({ role: "admin", userId: "admin" }, "adminRole.grant")).toBe(
      false,
    );
    expect(
      can({ role: "super_admin", userId: "super" }, "adminRole.grant"),
    ).toBe(true);
  });

  test("allows organizers to update only their future activities", () => {
    expect(
      can(
        { now: 100, role: "user", userId: "organizer" },
        "activity.updateOwn",
        {
          creatorId: "organizer",
          currentParticipantsCount: 2,
          maxParticipants: 8,
          startDateTime: 200,
        },
      ),
    ).toBe(true);
    expect(
      can({ now: 100, role: "user", userId: "other" }, "activity.updateOwn", {
        creatorId: "organizer",
        currentParticipantsCount: 2,
        maxParticipants: 8,
        startDateTime: 200,
      }),
    ).toBe(false);
    expect(
      can(
        { now: 300, role: "user", userId: "organizer" },
        "activity.updateOwn",
        {
          creatorId: "organizer",
          currentParticipantsCount: 2,
          maxParticipants: 8,
          startDateTime: 200,
        },
      ),
    ).toBe(false);
  });

  test("fails closed when contextual permissions receive missing or incompatible runtime context", () => {
    const actor = { now: 100, role: "user" as const, userId: "organizer" };

    expect(Reflect.apply(can, undefined, [actor, "activity.updateOwn"])).toBe(
      false,
    );
    expect(
      Reflect.apply(can, undefined, [
        actor,
        "activity.leaveOwn",
        {
          creatorId: "organizer",
          currentParticipantsCount: 2,
          maxParticipants: 8,
          startDateTime: 200,
        },
      ]),
    ).toBe(false);
    expect(
      createPermissionChecker(actor)("activity.updateOwn", {
        creatorId: "organizer",
        currentParticipantsCount: 2,
        maxParticipants: 8,
        startDateTime: 200,
      }),
    ).toBe(true);
  });
});
