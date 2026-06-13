import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Pressable, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { XStack, YStack } from "tamagui";

import { getThemeForColorScheme } from "@/src/lib/theme";
import { Text } from "@/ui/typography";

type TabBarProps = Parameters<
  NonNullable<React.ComponentProps<typeof Tabs>["tabBar"]>
>[0];

const tabIcons = {
  create: "add-circle",
  index: "map",
  list: "list",
  profile: "person-circle",
} as const;

export default function TabLayout() {
  const theme = getThemeForColorScheme(useColorScheme());

  return (
    <Tabs
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
      tabBar={(props) => <BeachTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: "Carte" }} />
      <Tabs.Screen name="list" options={{ title: "Liste" }} />
      <Tabs.Screen name="create" options={{ title: "Créer" }} />
      <Tabs.Screen name="profile" options={{ title: "Profil" }} />
    </Tabs>
  );
}

function BeachTabBar({ descriptors, navigation, state }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const theme = getThemeForColorScheme(useColorScheme());
  const bottomInset = Math.max(insets.bottom, 12);

  return (
    <YStack
      bg="$transparent"
      pointerEvents="box-none"
      px="$md"
      style={{
        bottom: bottomInset,
        left: 0,
        position: "absolute",
        right: 0,
        zIndex: 20,
      }}
    >
      <XStack
        bg="$surface"
        borderColor="$border"
        borderWidth={1}
        gap="$xs"
        height={80}
        p="$xs"
        rounded="$xl"
        shadowColor="$foreground"
        shadowOffset={{ height: 10, width: 0 }}
        shadowOpacity={0.08}
        shadowRadius={24}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const options = descriptors[route.key]?.options;
          const title =
            typeof options?.title === "string" ? options.title : route.name;
          const iconName =
            tabIcons[route.name as keyof typeof tabIcons] ?? "ellipse";

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : undefined}
              key={route.key}
              onPress={() => {
                const event = navigation.emit({
                  canPreventDefault: true,
                  target: route.key,
                  type: "tabPress",
                });

                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              }}
              style={{ flex: 1 }}
            >
              <YStack
                bg={focused ? "$secondary" : "$transparent"}
                flex={1}
                gap="$xxs"
                items="center"
                justify="center"
                style={{ borderRadius: 9999, overflow: "hidden" }}
              >
                <Ionicons
                  color={focused ? theme.accent : theme.mutedForeground}
                  name={iconName}
                  size={26}
                />
                <Text size="sm" weight="semibold">
                  {title}
                </Text>
              </YStack>
            </Pressable>
          );
        })}
      </XStack>
    </YStack>
  );
}
