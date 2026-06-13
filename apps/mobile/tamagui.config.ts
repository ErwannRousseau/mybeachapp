import { defaultConfig } from "@tamagui/config/v5";
import { createFont, createTamagui, createTokens } from "tamagui";

const lightColors = {
  accent: "#0077B6",
  background: "#F8FBFA",
  border: "#DDE7E5",
  card: "#FFFFFF",
  cardForeground: "#062A3B",
  color: "#062A3B",
  destructive: "#E85739",
  destructiveForeground: "#001923",
  destructiveSoft: "#FCE4DC",
  floatingSurface: "rgba(255, 255, 255, 0.94)",
  floatingSurfaceForeground: "#062A3B",
  foreground: "#062A3B",
  input: "#DDE7E5",
  muted: "#EEF4F3",
  mutedForeground: "#5E717A",
  primary: "#FF6B4A",
  primaryForeground: "#062A3B",
  primaryPressed: "#9F331F",
  ring: "#0077B6",
  secondary: "#EAF8FC",
  secondaryForeground: "#062A3B",
  success: "#1FAF84",
  successSoft: "#E5F5EE",
  surface: "#FFFFFF",
  surfaceForeground: "#062A3B",
  transparent: "rgba(255, 255, 255, 0)",
  warning: "#DDBB72",
  warningForeground: "#062A3B",
  warningSoft: "#FFF9EA",
} as const;

const darkColors = {
  ...lightColors,
  background: "#062A3B",
  border: "#245166",
  card: "#0B3447",
  cardForeground: "#F8FBFA",
  color: "#F8FBFA",
  floatingSurface: "rgba(11, 52, 71, 0.94)",
  floatingSurfaceForeground: "#F8FBFA",
  foreground: "#F8FBFA",
  input: "#245166",
  muted: "#123E55",
  mutedForeground: "#B8C8CC",
  secondary: "#123E55",
  secondaryForeground: "#F8FBFA",
  surface: "#0B3447",
  surfaceForeground: "#F8FBFA",
} as const;

export const lightTheme = lightColors;
export const darkTheme = darkColors;

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
  },
  size: {
    1: 13,
    2: 14,
    3: 16,
    4: 22,
    5: 28,
    6: 34,
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
  color: lightColors,
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
  themes: {
    dark: darkTheme,
    light: lightTheme,
  },
  tokens,
});

export default tamaguiConfig;

export type TamaguiConfig = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends TamaguiConfig {}
}
