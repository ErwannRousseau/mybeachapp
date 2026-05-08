import { describe, expect, test } from "bun:test";

import { isInsideViewport } from "./locations";

describe("location helpers", () => {
  test("detects coordinates inside a map viewport", () => {
    expect(
      isInsideViewport(47.28, -2.39, {
        north: 47.35,
        south: 47.2,
        east: -2.3,
        west: -2.5
      })
    ).toBe(true);
  });
});
