import {
  Circle,
  List,
  Map as MapIcon,
  PlusCircle,
  UserCircle,
} from "@tamagui/lucide-icons-2";
import type { Tabs } from "expo-router";
import { useCallback, useEffect } from "react";
import { Dimensions, Platform, Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { XStack, YStack } from "tamagui";

import { GlassView } from "@/ui/effects/glass-view";

import {
  getTabBarBottomOffset,
  getTabBarMetrics,
  TAB_BAR_BORDER_WIDTH,
  TAB_BAR_CONTENT_HEIGHT,
  TAB_BAR_HEIGHT,
  TAB_BAR_INSET,
} from "./tab-bar-metrics";

export type TabBarProps = Parameters<
  NonNullable<React.ComponentProps<typeof Tabs>["tabBar"]>
>[0];

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const tabIcons = {
  create: PlusCircle,
  index: MapIcon,
  list: List,
  profile: UserCircle,
} as const;

export function TabBar({ descriptors, navigation, state }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = getTabBarBottomOffset(
    insets.bottom,
    Platform.OS === "android" ? "android" : "ios",
  );
  const metrics = getTabBarMetrics(SCREEN_WIDTH, state.routes.length);
  const activeTabIndex = useSharedValue(state.index);

  useEffect(() => {
    activeTabIndex.value = withSpring(state.index, {
      damping: 30,
      mass: 0.8,
      stiffness: 680,
    });
  }, [activeTabIndex, state.index]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          activeTabIndex.value * metrics.tabWidth + metrics.indicatorOffset,
      },
    ],
    width: metrics.indicatorWidth,
  }));

  return (
    <YStack
      items="center"
      pointerEvents="box-none"
      style={{
        bottom: bottomInset,
        left: 0,
        position: "absolute",
        right: 0,
        zIndex: 20,
      }}
    >
      <Animated.View
        style={[
          styles.floatingShadow,
          {
            height: TAB_BAR_HEIGHT,
            width: metrics.containerWidth,
          },
        ]}
      >
        <GlassView
          borderWidth={TAB_BAR_BORDER_WIDTH}
          flex={1}
          height="100%"
          intensity={90}
          rounded={32}
          shadowColor="$foreground"
          shadowOffset={{ height: 20, width: 0 }}
          shadowOpacity={0.14}
          shadowRadius={30}
          width="100%"
        >
          <XStack
            height={TAB_BAR_CONTENT_HEIGHT}
            p={TAB_BAR_INSET}
            position="relative"
            width={metrics.containerWidth}
          >
            <Animated.View style={[styles.indicator, indicatorStyle]} />
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
        </GlassView>
      </Animated.View>
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
      accessibilityLabel={title}
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : undefined}
      onPress={handlePress}
      style={{ flex: 1 }}
    >
      <YStack
        flex={1}
        items="center"
        justify="center"
        opacity={focused ? 1 : 0.54}
      >
        <Icon color="$foreground" size={26} />
      </YStack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  floatingShadow: {
    backgroundColor: "transparent",
    elevation: 10,
    overflow: "visible",
  },
  indicator: {
    backgroundColor: "rgba(126, 126, 126, 0.2)",
    borderRadius: 100,
    height: TAB_BAR_CONTENT_HEIGHT - TAB_BAR_INSET * 2,
    left: 0,
    position: "absolute",
    top: TAB_BAR_INSET,
  },
});
