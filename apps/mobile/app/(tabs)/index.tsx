import {
  Camera,
  type CameraRef,
  Map as MapView,
  Marker,
  type ViewStateChangeEvent,
} from "@maplibre/maplibre-react-native";
import { api } from "@mybeachapp/backend/convex/_generated/api";
import type {
  ActivitySummary,
  ViewportBounds,
} from "@mybeachapp/shared/activities/types";
import { useQuery } from "convex/react";
import { Stack } from "expo-router";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { NativeSyntheticEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { YStack } from "tamagui";
import { ActivityCard } from "@/src/features/activities/components/activity-card";
import { ActivityMapLayer } from "@/src/features/activities/components/activity-map-layer";
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
const VIEWPORT_DEBOUNCE_MS = 300;
const activityTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  month: "short",
});

export default function HomeScreen() {
  const cameraRef = useRef<CameraRef>(null);
  const provisionalPinId = useId();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [selectedPlace, setSelectedPlace] = useState<PlaceCandidate | null>(
    null,
  );
  const viewportDebounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string>();
  const [viewport, setViewport] = useState<ViewportBounds>();
  const activities = useQuery(
    api.activities.listOpenByViewport,
    viewport ?? "skip",
  );
  const selectedActivity = activities?.find(
    ({ id }) => id === selectedActivityId,
  );
  const handleActivityPress = useCallback(
    ({ id }: ActivitySummary) => setSelectedActivityId(id),
    [],
  );
  const handleMapPress = useCallback(
    () => setSelectedActivityId(undefined),
    [],
  );
  const ornamentBottom =
    getTabBarBottomOffset(insets.bottom) + TAB_BAR_HEIGHT + 12;

  useEffect(
    () => () => {
      if (viewportDebounceRef.current) {
        clearTimeout(viewportDebounceRef.current);
      }
    },
    [],
  );

  function handleRegionDidChange(
    event: NativeSyntheticEvent<ViewStateChangeEvent>,
  ) {
    const [west, south, east, north] = event.nativeEvent.bounds;
    if (viewportDebounceRef.current) {
      clearTimeout(viewportDebounceRef.current);
    }
    viewportDebounceRef.current = setTimeout(() => {
      setViewport({ east, north, south, west });
    }, VIEWPORT_DEBOUNCE_MS);
  }

  function selectPlace(candidate: PlaceCandidate) {
    setSelectedPlace(candidate);
    cameraRef.current?.easeTo({
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
          onPress={handleMapPress}
          onRegionDidChange={handleRegionDidChange}
        >
          <Camera
            initialViewState={{
              center: PILOT_ZONE_CENTER,
              zoom: 11.5,
            }}
            ref={cameraRef}
          />
          <ActivityMapLayer
            activities={activities ?? []}
            cameraRef={cameraRef}
            onActivityPress={handleActivityPress}
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

        {selectedActivity ? (
          <YStack
            b={ornamentBottom + 24}
            l="$md"
            position="absolute"
            r="$md"
            z={10}
          >
            <ActivityCard
              category={selectedActivity.category}
              distance={
                selectedActivity.location.placeName ??
                selectedActivity.location.addressLabel
              }
              participants={`${selectedActivity.currentParticipantsCount} / ${selectedActivity.maxParticipants}`}
              status={selectedActivity.status}
              time={activityTimeFormatter.format(
                new Date(selectedActivity.startDateTime),
              )}
              title={selectedActivity.title}
            />
          </YStack>
        ) : null}
      </YStack>
    </>
  );
}
