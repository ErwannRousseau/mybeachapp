import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

import { getThemeForColorScheme } from "@/src/lib/theme";
import { TabBar, type TabBarProps } from "@/src/navigation/layout/TabBar";
import {
  BlurTargetContent,
  BlurTargetProvider,
} from "@/ui/effects/blur-target";

function renderTabBar(props: TabBarProps) {
  return <TabBar {...props} />;
}

function renderScreenLayout({ children }: { children: React.ReactNode }) {
  return <BlurTargetContent>{children}</BlurTargetContent>;
}

export default function TabLayout() {
  const theme = getThemeForColorScheme(useColorScheme());

  return (
    <BlurTargetProvider>
      <Tabs
        screenLayout={renderScreenLayout}
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTitleStyle: {
            color: theme.foreground,
          },
          sceneStyle: {
            backgroundColor: theme.background,
          },
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.mutedForeground,
          tabBarStyle: {
            backgroundColor: "transparent",
            borderTopWidth: 0,
            elevation: 0,
            position: "absolute",
          },
        }}
        tabBar={renderTabBar}
      >
        <Tabs.Screen name="index" options={{ title: "Carte" }} />
        <Tabs.Screen name="list" options={{ title: "Liste" }} />
        <Tabs.Screen name="create" options={{ title: "Créer" }} />
        <Tabs.Screen name="profile" options={{ title: "Profil" }} />
      </Tabs>
    </BlurTargetProvider>
  );
}
