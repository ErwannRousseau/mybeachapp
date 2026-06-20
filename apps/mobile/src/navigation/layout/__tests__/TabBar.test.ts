import { describe, expect, it } from "vitest";

import { getTabBarBottomOffset, getTabBarMetrics } from "../tab-bar-metrics";

describe("TabBar layout helpers", () => {
  it("uses a Takeout-like compact floating width", () => {
    expect(getTabBarMetrics(390, 4)).toEqual({
      containerWidth: 240,
      contentInset: 5,
      contentWidth: 230,
      indicatorOffset: 10,
      indicatorWidth: 47.5,
      tabWidth: 57.5,
    });
  });

  it("keeps bottom placement safe-area aware with a minimum offset", () => {
    expect(getTabBarBottomOffset(34)).toBe(26);
    expect(getTabBarBottomOffset(0)).toBe(10);
  });
});
