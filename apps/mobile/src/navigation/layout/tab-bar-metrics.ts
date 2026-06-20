import { isAndroid } from "@/src/lib/platform";

export const TAB_BAR_BORDER_WIDTH = 1;
export const TAB_BAR_CONTENT_HEIGHT = 50;
export const TAB_BAR_HEIGHT = TAB_BAR_CONTENT_HEIGHT + TAB_BAR_BORDER_WIDTH * 2;
export const TAB_BAR_INSET = 5;

const ANDROID_MIN_BOTTOM_OFFSET = 18;
const IOS_MIN_BOTTOM_OFFSET = 10;
const TAB_BAR_WIDTH_OFFSET = 150;

export type TabBarPlatform = "android" | "ios";

export function getTabBarBottomOffset(
  bottomInset: number,
  platform: TabBarPlatform = isAndroid() ? "android" : "ios",
) {
  if (platform === "android") {
    return Math.max(bottomInset, ANDROID_MIN_BOTTOM_OFFSET);
  }

  return Math.max(bottomInset - 8, IOS_MIN_BOTTOM_OFFSET);
}

export function getTabBarMetrics(screenWidth: number, routeCount: number) {
  const tabCount = Math.max(routeCount, 1);
  const containerWidth = screenWidth - TAB_BAR_WIDTH_OFFSET;
  const contentInset = TAB_BAR_INSET;
  const contentWidth = containerWidth - contentInset * 2;
  const tabWidth = contentWidth / tabCount;
  const indicatorWidth = tabWidth - TAB_BAR_INSET * 2;

  return {
    containerWidth,
    contentInset,
    contentWidth,
    indicatorOffset: contentInset + (tabWidth - indicatorWidth) / 2,
    indicatorWidth,
    tabWidth,
  };
}
