import { describe, expect, it } from "vitest";

import { getTabBarBottomOffset, getTabBarMetrics } from "../tab-bar-metrics";

describe("TabBar layout helpers", () => {
  it("uses a Takeout-like compact floating width", () => {
    expect(getTabBarMetrics(390, 4)).toEqual({
      containerWidth: 240,
      indicatorOffset: 5,
      indicatorWidth: 50,
      tabWidth: 60,
    });
  });

  it("keeps bottom placement safe-area aware with a minimum offset", () => {
    expect(getTabBarBottomOffset(34)).toBe(26);
    expect(getTabBarBottomOffset(0)).toBe(10);
  });
});
