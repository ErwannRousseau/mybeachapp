import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TamaguiProvider } from "tamagui";

import { tamaguiConfig } from "../../tamagui.config";
import { AppProviders } from "./app-providers";

export function RootProviders({ children }: React.PropsWithChildren) {
  const colorScheme = useColorScheme();
  const themeName = colorScheme === "dark" ? "dark" : "light";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme={themeName}>
        <ThemeProvider value={themeName === "dark" ? DarkTheme : DefaultTheme}>
          <AppProviders>{children}</AppProviders>
        </ThemeProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}
