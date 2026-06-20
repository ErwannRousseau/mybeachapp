import type { ColorSchemeName } from "react-native";

import { darkTheme, lightTheme } from "../../tamagui.config";

export function getThemeForColorScheme(colorScheme: ColorSchemeName) {
  return colorScheme === "dark" ? darkTheme : lightTheme;
}

export function getThemeForMode(isDark: boolean) {
  return isDark ? darkTheme : lightTheme;
}
