import {
  green,
  greenDark,
  red,
  redDark,
  yellow,
  yellowDark,
} from "@tamagui/colors";
import { createV5Theme, defaultChildrenThemes } from "@tamagui/config/v5";
import { v5ComponentThemes } from "@tamagui/themes/v5";

const darkPalette = [
  "hsla(235, 45%, 5%, 1)",
  "hsla(236, 46%, 9%, 1)",
  "hsla(238, 48%, 14%, 1)",
  "hsla(239, 49%, 18%, 1)",
  "hsla(240, 50%, 22%, 1)",
  "hsla(240, 51%, 29%, 1)",
  "hsla(240, 52%, 35%, 1)",
  "hsla(240, 53%, 42%, 1)",
  "hsla(240, 54%, 48%, 1)",
  "hsla(240, 55%, 55%, 1)",
  "hsla(240, 40%, 92%, 1)",
  "hsla(235, 30%, 98%, 1)",
];

const lightPalette = [
  "hsla(235, 20%, 97%, 1)",
  "hsla(236, 23%, 91%, 1)",
  "hsla(238, 25%, 85%, 1)",
  "hsla(239, 28%, 78%, 1)",
  "hsla(240, 30%, 72%, 1)",
  "hsla(240, 32%, 67%, 1)",
  "hsla(240, 34%, 61%, 1)",
  "hsla(240, 36%, 56%, 1)",
  "hsla(240, 38%, 50%, 1)",
  "hsla(240, 40%, 45%, 1)",
  "hsla(240, 55%, 12%, 1)",
  "hsla(235, 65%, 4%, 1)",
];

const accentLight = {
  accent1: "hsla(46, 30%, 98%, 1)",
  accent2: "hsla(46, 40%, 93%, 1)",
  accent3: "hsla(45, 50%, 88%, 1)",
  accent4: "hsla(45, 60%, 83%, 1)",
  accent5: "hsla(44, 70%, 78%, 1)",
  accent6: "hsla(44, 74%, 72%, 1)",
  accent7: "hsla(43, 77%, 66%, 1)",
  accent8: "hsla(43, 81%, 60%, 1)",
  accent9: "hsla(42, 84%, 54%, 1)",
  accent10: "hsla(42, 88%, 48%, 1)",
  accent11: "hsla(40, 92%, 16%, 1)",
  accent12: "hsla(38, 95%, 5%, 1)",
} as const;

const accentDark = {
  accent1: "hsla(46, 51%, 12%, 1)",
  accent2: "hsla(46, 54%, 16%, 1)",
  accent3: "hsla(45, 58%, 20%, 1)",
  accent4: "hsla(45, 61%, 24%, 1)",
  accent5: "hsla(44, 65%, 28%, 1)",
  accent6: "hsla(44, 68%, 33%, 1)",
  accent7: "hsla(43, 70%, 38%, 1)",
  accent8: "hsla(43, 73%, 42%, 1)",
  accent9: "hsla(42, 75%, 47%, 1)",
  accent10: "hsla(42, 78%, 52%, 1)",
  accent11: "hsla(40, 82%, 88%, 1)",
  accent12: "hsla(38, 88%, 96%, 1)",
} as const;

export const semanticLightColors = {
  accent: accentLight.accent9,
  background: lightPalette[0],
  border: lightPalette[2],
  card: "#FFFFFF",
  cardForeground: lightPalette[10],
  color: lightPalette[10],
  destructive: red.red9,
  destructiveForeground: red.red12,
  destructiveSoft: red.red3,
  floatingSurface: "rgba(255, 255, 255, 0.94)",
  floatingSurfaceForeground: lightPalette[10],
  foreground: lightPalette[10],
  input: lightPalette[2],
  muted: lightPalette[1],
  mutedForeground: lightPalette[8],
  primary: "#FF6B4A",
  primaryForeground: lightPalette[10],
  primaryPressed: "#9F331F",
  ring: accentLight.accent9,
  secondary: accentLight.accent3,
  secondaryForeground: accentLight.accent12,
  success: green.green9,
  successSoft: green.green3,
  surface: "#FFFFFF",
  surfaceForeground: lightPalette[10],
  transparent: "rgba(255, 255, 255, 0)",
  warning: yellow.yellow9,
  warningForeground: yellow.yellow12,
  warningSoft: yellow.yellow3,
} as const;

export const semanticDarkColors = {
  ...semanticLightColors,
  background: darkPalette[0],
  border: darkPalette[4],
  card: darkPalette[1],
  cardForeground: darkPalette[11],
  color: darkPalette[11],
  destructive: redDark.red9,
  destructiveForeground: redDark.red12,
  destructiveSoft: redDark.red3,
  floatingSurface: "rgba(13, 14, 33, 0.94)",
  floatingSurfaceForeground: darkPalette[11],
  foreground: darkPalette[11],
  input: darkPalette[4],
  muted: darkPalette[2],
  mutedForeground: darkPalette[10],
  ring: accentDark.accent9,
  secondary: accentDark.accent4,
  secondaryForeground: accentDark.accent12,
  success: greenDark.green9,
  successSoft: greenDark.green3,
  surface: darkPalette[1],
  surfaceForeground: darkPalette[11],
  warning: yellowDark.yellow9,
  warningForeground: yellowDark.yellow12,
  warningSoft: yellowDark.yellow3,
} as const;

const builtThemes = createV5Theme({
  accent: {
    dark: accentDark,
    light: accentLight,
  },
  childrenThemes: {
    ...defaultChildrenThemes,
    error: {
      dark: redDark,
      light: red,
    },
    success: {
      dark: greenDark,
      light: green,
    },
    warning: {
      dark: yellowDark,
      light: yellow,
    },
  },
  componentThemes: v5ComponentThemes,
  darkPalette,
  lightPalette,
});

function isDarkTheme(themeName: string) {
  return themeName === "dark" || themeName.startsWith("dark_");
}

function withSemanticColors<SourceThemes extends Record<string, object>>(
  sourceThemes: SourceThemes,
) {
  return Object.fromEntries(
    Object.entries(sourceThemes).map(([themeName, theme]) => [
      themeName,
      {
        ...theme,
        ...(isDarkTheme(themeName) ? semanticDarkColors : semanticLightColors),
      },
    ]),
  ) as {
    [ThemeName in keyof SourceThemes]: SourceThemes[ThemeName] &
      (typeof semanticLightColors | typeof semanticDarkColors);
  };
}

export const themes = withSemanticColors(builtThemes);
export const lightTheme = themes.light;
export const darkTheme = themes.dark;
export type Themes = typeof themes;
