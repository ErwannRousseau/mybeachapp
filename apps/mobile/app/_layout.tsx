import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useUnistyles } from "react-native-unistyles";

import { AppProviders } from "@/src/providers/app-providers";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const { theme } = useUnistyles();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProviders>
        <Stack
          screenOptions={{
            contentStyle: {
              backgroundColor: theme.colors.background,
            },
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTintColor: theme.colors.onSurface,
            headerTitleStyle: {
              color: theme.colors.onSurface,
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ title: "Bienvenue" }} />
          <Stack.Screen name="sign-in" options={{ title: "Connexion" }} />
        </Stack>
      </AppProviders>
    </GestureHandlerRootView>
  );
}
