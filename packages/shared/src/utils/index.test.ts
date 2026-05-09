import { describe, expect, test } from "vitest";

import { getRemainingPlaces, isActivityJoinable } from ".";

describe("activity helpers", () => {
  test("calculates remaining places without negative values", () => {
    expect(getRemainingPlaces(6, 4)).toBe(2);
    expect(getRemainingPlaces(6, 8)).toBe(0);
  });

  test("allows joining open activities with remaining places", () => {
    expect(isActivityJoinable("open", 1)).toBe(true);
    expect(isActivityJoinable("full", 1)).toBe(false);
  });
});
