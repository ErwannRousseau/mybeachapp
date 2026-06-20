import { describe, expect, test } from "vitest";

import { isInsideViewport } from "../locations";

describe("location helpers", () => {
  test("detects coordinates inside a map viewport", () => {
    expect(
      isInsideViewport(47.28, -2.39, {
        east: -2.3,
        north: 47.35,
        south: 47.2,
        west: -2.5,
      }),
    ).toBe(true);
  });
});
