import { describe, expect, test } from "vitest";

import { isUserRole, isUserStatus } from "./validators";

describe("user validators", () => {
  test("user role guard", () => {
    expect(isUserRole("super_admin")).toBe(true);
    expect(isUserRole("guest")).toBe(false);
  });

  test("user status guard", () => {
    expect(isUserStatus("active")).toBe(true);
    expect(isUserStatus("banned")).toBe(false);
  });
});
