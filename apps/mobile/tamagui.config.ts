import { defaultConfig } from "@tamagui/config/v5";
import { createFont, createTamagui, createTokens } from "@tamagui/core";

import { semanticLightColors, themes } from "./themes";

export { darkTheme, lightTheme } from "./themes";

const bodyFont = createFont({
  family: "System",
  letterSpacing: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  },
  lineHeight: {
    1: 18,
    2: 22,
    3: 24,
    4: 28,
    5: 34,
    6: 40,
    bodyMd: 24,
    headlineDisplay: 40,
    headlineLg: 34,
    headlineMd: 28,
    labelMd: 18,
    labelSm: 14,
    titleSm: 24,
  },
  size: {
    1: 13,
    2: 14,
    3: 16,
    4: 22,
    5: 28,
    6: 34,
    bodyMd: 16,
    headlineDisplay: 34,
    headlineLg: 28,
    headlineMd: 22,
    labelMd: 13,
    labelSm: 11,
    titleSm: 18,
  },
  weight: {
    4: "400",
    5: "500",
    6: "600",
    7: "700",
  },
});

const tokens = createTokens({
  ...defaultConfig.tokens,
  color: semanticLightColors,
  radius: {
    ...defaultConfig.tokens.radius,
    full: 9999,
    lg: 20,
    md: 16,
    none: 0,
    sm: 12,
    xl: 24,
    xs: 8,
    xxl: 32,
  },
  size: {
    ...defaultConfig.tokens.size,
    button: 54,
    input: 52,
    none: 0,
    touchMin: 44,
    touchPreferred: 48,
  },
  space: {
    ...defaultConfig.tokens.space,
    lg: 20,
    md: 16,
    none: 0,
    sm: 12,
    xl: 24,
    xs: 8,
    xxl: 32,
    xxs: 4,
  },
});

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  fonts: {
    ...defaultConfig.fonts,
    body: bodyFont,
    heading: bodyFont,
  },
  themes,
  tokens,
});

export default tamaguiConfig;

export type TamaguiConfig = typeof tamaguiConfig;

declare module "@tamagui/core" {
  interface TamaguiCustomConfig extends TamaguiConfig {}
}
