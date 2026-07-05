import { describe, expect, test } from "vitest";

import { getPermissionActor } from "../permission-actor";

describe("getPermissionActor", () => {
  test("defaults signed-in users without a profile to user permissions", () => {
    expect(
      getPermissionActor(
        { email: "beach@example.com", id: "user-1", name: null },
        null,
      ),
    ).toEqual({
      role: "user",
      userId: "user-1",
    });
  });

  test("uses the beach profile role when available", () => {
    expect(
      getPermissionActor(
        { email: "admin@example.com", id: "user-2", name: null },
        { role: "admin", status: "active" },
      ),
    ).toEqual({
      role: "admin",
      userId: "user-2",
    });
  });

  test("blocks disabled profiles", () => {
    expect(
      getPermissionActor(
        { email: "admin@example.com", id: "user-3", name: null },
        { role: "admin", status: "disabled" },
      ),
    ).toBeNull();
  });
});
