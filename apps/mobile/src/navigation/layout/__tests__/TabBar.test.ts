import { describe, expect, it } from "vitest";

import {
  getTabBarBottomOffset,
  getTabBarMetrics,
  TAB_BAR_BORDER_WIDTH,
  TAB_BAR_CONTENT_HEIGHT,
  TAB_BAR_HEIGHT,
} from "../tab-bar-metrics";

describe("TabBar layout helpers", () => {
  it("includes the border outside the content height", () => {
    expect(TAB_BAR_HEIGHT).toBe(
      TAB_BAR_CONTENT_HEIGHT + TAB_BAR_BORDER_WIDTH * 2,
    );
  });

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

  it("preserves the approved iOS safe-area placement", () => {
    expect(getTabBarBottomOffset(34, "ios")).toBe(26);
    expect(getTabBarBottomOffset(0, "ios")).toBe(10);
  });

  it("keeps the Android bar above system navigation", () => {
    expect(getTabBarBottomOffset(24, "android")).toBe(24);
    expect(getTabBarBottomOffset(0, "android")).toBe(18);
  });
});
