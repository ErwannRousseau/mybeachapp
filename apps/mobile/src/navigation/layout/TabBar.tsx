import {
  Circle,
  List,
  Map as MapIcon,
  PlusCircle,
  UserCircle,
} from "@tamagui/lucide-icons-2";
import type { Tabs } from "expo-router";
import { useCallback } from "react";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { XStack, YStack } from "tamagui";

import { Text } from "@/ui/typography";

export type TabBarProps = Parameters<
  NonNullable<React.ComponentProps<typeof Tabs>["tabBar"]>
>[0];

const tabIcons = {
  create: PlusCircle,
  index: MapIcon,
  list: List,
  profile: UserCircle,
} as const;

export function TabBar({ descriptors, navigation, state }: TabBarProps) {
  const insets = useSafeAreaInsets();
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
        {state.routes.map((route, index) => (
          <TabBarItem
            descriptors={descriptors}
            index={index}
            key={route.key}
            navigation={navigation}
            route={route}
            selectedIndex={state.index}
          />
        ))}
      </XStack>
    </YStack>
  );
}

type TabBarItemProps = {
  descriptors: TabBarProps["descriptors"];
  index: number;
  navigation: TabBarProps["navigation"];
  route: TabBarProps["state"]["routes"][number];
  selectedIndex: number;
};

function TabBarItem({
  descriptors,
  index,
  navigation,
  route,
  selectedIndex,
}: TabBarItemProps) {
  const focused = selectedIndex === index;
  const options = descriptors[route.key]?.options;
  const title = typeof options?.title === "string" ? options.title : route.name;
  const Icon = tabIcons[route.name as keyof typeof tabIcons] ?? Circle;

  const handlePress = useCallback(() => {
    const event = navigation.emit({
      canPreventDefault: true,
      target: route.key,
      type: "tabPress",
    });

    if (!focused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  }, [focused, navigation, route.key, route.name, route.params]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : undefined}
      onPress={handlePress}
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
        <Icon color={focused ? "$accent" : "$mutedForeground"} size={26} />
        <Text size="sm" weight="semibold">
          {title}
        </Text>
      </YStack>
    </Pressable>
  );
}
