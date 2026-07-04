import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

import { getThemeForColorScheme } from "@/src/lib/theme";
import { RootProviders } from "@/src/providers/root-providers";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  return (
    <RootProviders>
      <RootNavigator />
    </RootProviders>
  );
}

function RootNavigator() {
  const theme = getThemeForColorScheme(useColorScheme());

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: theme.background,
        },
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.foreground,
        headerTitleStyle: {
          color: theme.foreground,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ title: "Bienvenue" }} />
      <Stack.Screen name="sign-in" options={{ title: "Connexion" }} />
      <Stack.Screen name="sign-up" options={{ title: "Inscription" }} />
    </Stack>
  );
}
