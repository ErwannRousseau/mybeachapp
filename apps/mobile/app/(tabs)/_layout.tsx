import { Link, Tabs } from "expo-router";

import { useUnistyles } from "react-native-unistyles";

import { HeaderButton } from "../../components/HeaderButton";
import { TabBarIcon } from "../../components/TabBarIcon";

export default function TabLayout() {
  const { theme } = useUnistyles();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTitleStyle: {
          color: theme.colors.typography,
        },
        tabBarActiveTintColor: theme.colors.astral,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerRight: () => (
            <Link asChild href="/modal">
              <HeaderButton />
            </Link>
          ),
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name="code" />,
          title: "Tab One",
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name="code" />,
          title: "Tab Two",
        }}
      />
    </Tabs>
  );
}
