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
import { LocateFixed } from "@tamagui/lucide-icons-2";
import { useQuery } from "convex/react";
import { Stack } from "expo-router";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { NativeSyntheticEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { YStack } from "tamagui";
import { formatActivityStartTime } from "@/src/features/activities/activity-presentation";
import { ActivityCard } from "@/src/features/activities/components/activity-card";
import { ActivityMapLayer } from "@/src/features/activities/components/activity-map-layer";
import { GPSPin } from "@/src/features/activities/components/activity-map-pin";
import { PlaceSearchOverlay } from "@/src/features/map/components/place-search-overlay";
import type { PlaceCandidate } from "@/src/features/map/place-search";
import { useForegroundLocation } from "@/src/features/map/use-foreground-location";
import { useLocale } from "@/src/localization/use-locale";
import {
  getTabBarBottomOffset,
  TAB_BAR_HEIGHT,
} from "@/src/navigation/layout/tab-bar-metrics";
import { Button } from "@/ui/button";
import { FloatingSurface } from "@/ui/surface";
import { Text } from "@/ui/typography";

const OPENFREEMAP_LIBERTY_STYLE =
  "https://tiles.openfreemap.org/styles/liberty";
const PILOT_ZONE_CENTER: [longitude: number, latitude: number] = [
  -2.3242, 47.2591,
];
const VIEWPORT_DEBOUNCE_MS = 300;

export default function HomeScreen() {
  const cameraRef = useRef<CameraRef>(null);
  const provisionalPinId = useId();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { currentLocale } = useLocale();
  const { devicePosition, isLocating, locateDevice, locationFeedback } =
    useForegroundLocation();
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
          logo={false}
          mapStyle={OPENFREEMAP_LIBERTY_STYLE}
          onPress={handleMapPress}
          onRegionDidChange={handleRegionDidChange}
        >
          <Camera
            center={devicePosition ?? undefined}
            duration={devicePosition ? 600 : undefined}
            initialViewState={{
              center: PILOT_ZONE_CENTER,
              zoom: 11.5,
            }}
            ref={cameraRef}
            zoom={devicePosition ? 14 : undefined}
          />
          <ActivityMapLayer
            activities={activities ?? []}
            cameraRef={cameraRef}
            onActivityPress={handleActivityPress}
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

        <YStack
          b={ornamentBottom}
          gap="$md"
          l="$md"
          mb="$3.5"
          position="absolute"
          r="$md"
          z={10}
        >
          <YStack items="flex-end" self="flex-end">
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

          {selectedActivity ? (
            <ActivityCard
              category={selectedActivity.category}
              distance={
                selectedActivity.location.placeName ??
                selectedActivity.location.addressLabel
              }
              participants={`${selectedActivity.currentParticipantsCount} / ${selectedActivity.maxParticipants}`}
              status={selectedActivity.status}
              time={formatActivityStartTime(
                selectedActivity.startDateTime,
                currentLocale,
              )}
              title={selectedActivity.title}
            />
          ) : null}
        </YStack>
      </YStack>
    </>
  );
}
