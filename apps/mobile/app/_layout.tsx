import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
      <Stack.Screen
        name="onboarding"
        options={{ title: t("navigation.onboarding") }}
      />
      <Stack.Screen
        name="sign-in"
        options={{ title: t("navigation.signIn") }}
      />
      <Stack.Screen
        name="sign-up"
        options={{ title: t("navigation.signUp") }}
      />
    </Stack>
  );
}
