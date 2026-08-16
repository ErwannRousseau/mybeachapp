import {
  Camera,
  type CameraRef,
  Map as MapView,
  Marker,
} from "@maplibre/maplibre-react-native";
import { Stack } from "expo-router";
import { useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { YStack } from "tamagui";
import { GPSPin } from "@/src/features/activities/components/activity-map-pin";
import { PlaceSearchOverlay } from "@/src/features/map/components/place-search-overlay";
import type { PlaceCandidate } from "@/src/features/map/place-search";
import {
  getTabBarBottomOffset,
  TAB_BAR_HEIGHT,
} from "@/src/navigation/layout/tab-bar-metrics";

const OPENFREEMAP_LIBERTY_STYLE =
  "https://tiles.openfreemap.org/styles/liberty";
const PILOT_ZONE_CENTER: [longitude: number, latitude: number] = [
  -2.3242, 47.2591,
];

export default function HomeScreen() {
  const camera = useRef<CameraRef>(null);
  const provisionalPinId = useId();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [selectedPlace, setSelectedPlace] = useState<PlaceCandidate | null>(
    null,
  );
  const ornamentBottom =
    getTabBarBottomOffset(insets.bottom) + TAB_BAR_HEIGHT + 12;

  function selectPlace(candidate: PlaceCandidate) {
    setSelectedPlace(candidate);
    camera.current?.easeTo({
      center: candidate.coordinates,
      duration: 600,
      zoom: 14,
    });
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
            initialViewState={{
              center: PILOT_ZONE_CENTER,
              zoom: 11.5,
            }}
            ref={camera}
          />
          {selectedPlace ? (
            <Marker
              anchor="bottom"
              id={provisionalPinId}
              lngLat={selectedPlace.coordinates}
            >
              <GPSPin
                accessibilityLabel={t(
                  "activities.home.placeSearch.provisionalPin",
                )}
              >
                GPS
              </GPSPin>
            </Marker>
          ) : null}
        </MapView>

        <YStack l="$md" position="absolute" r="$md" t={insets.top + 12} z={10}>
          <PlaceSearchOverlay onSelect={selectPlace} />
        </YStack>
      </YStack>
    </>
  );
}
