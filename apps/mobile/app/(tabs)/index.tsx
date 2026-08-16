import {
  Camera,
  Map as MapView,
  Marker,
} from "@maplibre/maplibre-react-native";
import { LocateFixed } from "@tamagui/lucide-icons-2";
import * as Location from "expo-location";
import { Stack } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { YStack } from "tamagui";

import {
  getTabBarBottomOffset,
  TAB_BAR_HEIGHT,
} from "@/src/navigation/layout/tab-bar-metrics";
import { Button } from "@/ui/button";
import { SearchBar } from "@/ui/search-bar";
import { FloatingSurface } from "@/ui/surface";
import { Text } from "@/ui/typography";

const OPENFREEMAP_LIBERTY_STYLE =
  "https://tiles.openfreemap.org/styles/liberty";
const PILOT_ZONE_CENTER: [longitude: number, latitude: number] = [
  -2.3242, 47.2591,
];
const DEVICE_LOCATION_TIMEOUT_MS = 10_000;

async function getCurrentDevicePosition() {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }),
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(reject, DEVICE_LOCATION_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [devicePosition, setDevicePosition] = useState<
    [longitude: number, latitude: number] | null
  >(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationFeedback, setLocationFeedback] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const ornamentBottom =
    getTabBarBottomOffset(insets.bottom) + TAB_BAR_HEIGHT + 12;

  async function locateDevice() {
    setIsLocating(true);
    setLocationFeedback(null);

    try {
      let permission = await Location.getForegroundPermissionsAsync();

      if (permission.status === Location.PermissionStatus.UNDETERMINED) {
        permission = await Location.requestForegroundPermissionsAsync();
      }

      if (!permission.granted) {
        setLocationFeedback(t("activities.home.locationDenied"));
        return;
      }

      const position = await getCurrentDevicePosition();
      setDevicePosition([position.coords.longitude, position.coords.latitude]);
      setLocationFeedback(t("activities.home.locationFound"));
    } catch {
      setLocationFeedback(t("activities.home.locationUnavailable"));
    } finally {
      setIsLocating(false);
    }
  }

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
            center={devicePosition ?? undefined}
            duration={devicePosition ? 600 : undefined}
            initialViewState={{
              center: PILOT_ZONE_CENTER,
              zoom: 11.5,
            }}
            zoom={devicePosition ? 14 : undefined}
          />
          {devicePosition ? (
            <Marker lngLat={devicePosition}>
              <YStack
                accessibilityLabel={t("activities.home.devicePosition")}
                accessibilityRole="image"
                bg="$surface"
                borderColor="$accent"
                borderWidth={2}
                p="$xs"
                rounded="$full"
              >
                <YStack bg="$accent" height="$2" rounded="$full" width="$2" />
              </YStack>
            </Marker>
          ) : null}
        </MapView>

        <YStack l="$md" position="absolute" r="$md" t={insets.top + 12} z={10}>
          <SearchBar
            accessibilityLabel="Rechercher un lieu"
            onChangeText={setSearchQuery}
            placeholder={t("activities.home.searchPlaceholder")}
            value={searchQuery}
          />
        </YStack>

        <YStack b={ornamentBottom} mb="$3.5" position="absolute" r="$md" z={10}>
          {locationFeedback ? (
            <FloatingSurface maxW={280} mb="$sm" p="$sm">
              <Text
                accessibilityLiveRegion="polite"
                accessibilityRole="alert"
                size="md"
              >
                {locationFeedback}
              </Text>
            </FloatingSurface>
          ) : null}
          <Button
            accessibilityLabel={t("activities.home.locate")}
            fullWidth={false}
            icon={LocateFixed}
            loading={isLocating}
            loadingLabel={t("activities.home.locating")}
            onPress={locateDevice}
            size="sm"
            variant="surface"
          >
            {t("activities.home.locate")}
          </Button>
        </YStack>
      </YStack>
    </>
  );
}
