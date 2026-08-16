import { Camera, Map as MapView } from "@maplibre/maplibre-react-native";
import { Stack } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { YStack } from "tamagui";

import {
  getTabBarBottomOffset,
  TAB_BAR_HEIGHT,
} from "@/src/navigation/layout/tab-bar-metrics";
import { SearchBar } from "@/ui/search-bar";

const OPENFREEMAP_LIBERTY_STYLE =
  "https://tiles.openfreemap.org/styles/liberty";
const PILOT_ZONE_CENTER: [longitude: number, latitude: number] = [
  -2.3242, 47.2591,
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const ornamentBottom =
    getTabBarBottomOffset(insets.bottom) + TAB_BAR_HEIGHT + 12;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <YStack bg="$background" flex={1}>
        <MapView
          attribution
          attributionPosition={{ bottom: ornamentBottom, right: 12 }}
          compass
          compassPosition={{ right: 12, top: insets.top + 76 }}
          logo
          logoPosition={{ bottom: ornamentBottom, left: 12 }}
          mapStyle={OPENFREEMAP_LIBERTY_STYLE}
        >
          <Camera
            initialViewState={{
              center: PILOT_ZONE_CENTER,
              zoom: 11.5,
            }}
          />
        </MapView>

        <YStack l="$md" position="absolute" r="$md" t={insets.top + 12} z={10}>
          <SearchBar
            accessibilityLabel="Rechercher un lieu"
            onChangeText={setSearchQuery}
            placeholder={t("activities.home.searchPlaceholder")}
            value={searchQuery}
          />
        </YStack>
      </YStack>
    </>
  );
}
