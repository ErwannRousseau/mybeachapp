const INDICATOR_INSET = 5;
const TAB_BAR_WIDTH_OFFSET = 150;

export function getTabBarBottomOffset(bottomInset: number) {
  return Math.max(bottomInset - 8, 10);
}

export function getTabBarMetrics(screenWidth: number, routeCount: number) {
  const tabCount = Math.max(routeCount, 1);
  const containerWidth = screenWidth - TAB_BAR_WIDTH_OFFSET;
  const tabWidth = containerWidth / tabCount;
  const indicatorWidth = tabWidth - INDICATOR_INSET * 2;

  return {
    containerWidth,
    indicatorOffset: INDICATOR_INSET,
    indicatorWidth,
    tabWidth,
  };
}
