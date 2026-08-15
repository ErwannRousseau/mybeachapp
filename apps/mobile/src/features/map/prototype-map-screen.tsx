import {
  Camera,
  type CameraRef,
  GeoJSONSource,
  type GeoJSONSourceRef,
  Layer,
  Map as MapView,
  type PressEvent,
  type PressEventWithFeatures,
  ViewAnnotation,
  type ViewAnnotationEvent,
} from "@maplibre/maplibre-react-native";
import { MapPin } from "@tamagui/lucide-icons-2";
import { useCallback, useId, useMemo, useRef, useState } from "react";
import {
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { XStack, YStack } from "tamagui";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { SearchBar } from "@/ui/search-bar";
import { FloatingSurface } from "@/ui/surface";
import { Text, Title } from "@/ui/typography";

import {
  type PlaceCandidate,
  reverseGeocode,
  searchPlaces,
} from "./prototype-geocoding";

type CartographyCandidate = "geoapify" | "openfreemap";
type Coordinate = [longitude: number, latitude: number];

const PORNICHET: Coordinate = [-2.3242, 47.2591];
const INITIAL_PIN: Coordinate = [-2.353059, 47.270832];
const OPENFREEMAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";
const GEOAPIFY_KEY = process.env.EXPO_PUBLIC_GEOAPIFY_MAP_KEY?.trim();
const GEOAPIFY_STYLE = `https://maps.geoapify.com/v1/styles/osm-bright-smooth/style.json?apiKey=${GEOAPIFY_KEY ?? "missing-prototype-key"}`;

const ACTIVITY_COORDINATES: Coordinate[] = [
  [-2.3528, 47.2706],
  [-2.3509, 47.2722],
  [-2.3478, 47.2697],
  [-2.3424, 47.2674],
  [-2.3385, 47.2658],
  [-2.3332, 47.2635],
  [-2.3298, 47.2617],
  [-2.3247, 47.2592],
  [-2.3209, 47.2581],
  [-2.3168, 47.2563],
  [-2.3127, 47.2547],
  [-2.3082, 47.2534],
  [-2.3029, 47.2518],
  [-2.3841, 47.2826],
  [-2.3817, 47.2804],
  [-2.3782, 47.2788],
  [-2.3748, 47.2775],
  [-2.3699, 47.2759],
  [-2.3651, 47.2742],
  [-2.3605, 47.2729],
  [-2.2957, 47.2504],
  [-2.2891, 47.2487],
  [-2.2824, 47.2468],
  [-2.2752, 47.2445],
];

const ACTIVITY_POINTS: GeoJSON.FeatureCollection<
  GeoJSON.Point,
  { activityId: string }
> = {
  features: ACTIVITY_COORDINATES.map((coordinates, index) => ({
    geometry: { coordinates, type: "Point" },
    properties: { activityId: `prototype-${index + 1}` },
    type: "Feature",
  })),
  type: "FeatureCollection",
};

function formatCoordinates([longitude, latitude]: Coordinate) {
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
}

function PlaceResult({
  index,
  onSelect,
  place,
}: {
  index: number;
  onSelect: (place: PlaceCandidate) => void;
  place: PlaceCandidate;
}) {
  const handlePress = useCallback(() => onSelect(place), [onSelect, place]);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={handlePress}
      style={styles.result}
      testID={`prototype-result-${index}`}
    >
      <Text weight="semibold">{place.label}</Text>
      <Text size="sm" variant="muted">
        {place.provider === "ign" ? "IGN" : "Communes"} · {place.kind}
      </Text>
    </Pressable>
  );
}

export function PrototypeMapScreen() {
  const insets = useSafeAreaInsets();
  const sourceId = useId();
  const clustersId = useId();
  const clusterCountsId = useId();
  const activityPinsId = useId();
  const gpsPinId = useId();
  const cameraRef = useRef<CameraRef>(null);
  const activitiesRef = useRef<GeoJSONSourceRef>(null);
  const mapStartedAtRef = useRef(performance.now());
  const reverseRequestRef = useRef(0);
  const [candidate, setCandidate] =
    useState<CartographyCandidate>("openfreemap");
  const [mapStage, setMapStage] = useState("chargement");
  const [mapLoadMs, setMapLoadMs] = useState<number | null>(null);
  const [query, setQuery] = useState("Plage des Libraires Pornichet");
  const [results, setResults] = useState<PlaceCandidate[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState("Recherche non lancée");
  const [pinCoordinates, setPinCoordinates] = useState<Coordinate>(INITIAL_PIN);
  const [meetingPointLabel, setMeetingPointLabel] = useState(
    "Plage des Libraires 44380 Pornichet",
  );

  const mapStyle = useMemo(
    () => (candidate === "openfreemap" ? OPENFREEMAP_STYLE : GEOAPIFY_STYLE),
    [candidate],
  );

  const selectCandidate = useCallback((next: CartographyCandidate) => {
    mapStartedAtRef.current = performance.now();
    setMapLoadMs(null);
    setMapStage(
      next === "geoapify" && !GEOAPIFY_KEY
        ? "clé Geoapify absente"
        : "chargement",
    );
    setCandidate(next);
  }, []);

  const runReverseGeocode = useCallback(async (coordinates: Coordinate) => {
    const requestId = reverseRequestRef.current + 1;
    reverseRequestRef.current = requestId;
    setSearchStatus("Géocodage inverse IGN…");

    try {
      const result = await reverseGeocode(coordinates);
      if (requestId !== reverseRequestRef.current) {
        return;
      }
      if (result.value) {
        setMeetingPointLabel(result.value.label);
        setSearchStatus(`Inverse IGN ${result.elapsedMs} ms`);
      } else {
        setSearchStatus("Aucun libellé IGN — saisie manuelle disponible");
      }
    } catch (error) {
      if (requestId === reverseRequestRef.current) {
        setSearchStatus(
          `Inverse indisponible — saisie manuelle (${error instanceof Error ? error.message : "erreur"})`,
        );
      }
    }
  }, []);

  const movePin = useCallback(
    (coordinates: Coordinate) => {
      setPinCoordinates(coordinates);
      void runReverseGeocode(coordinates);
    },
    [runReverseGeocode],
  );

  const handleMapPress = useCallback(
    (event: NativeSyntheticEvent<PressEvent>) => {
      movePin(event.nativeEvent.lngLat);
    },
    [movePin],
  );

  const handlePinDragEnd = useCallback(
    (event: NativeSyntheticEvent<ViewAnnotationEvent>) => {
      movePin(event.nativeEvent.lngLat);
    },
    [movePin],
  );

  const handleActivityPress = useCallback(
    async (event: NativeSyntheticEvent<PressEventWithFeatures>) => {
      const feature = event.nativeEvent.features[0];
      if (feature?.geometry.type !== "Point") {
        return;
      }

      const coordinates = feature.geometry.coordinates as Coordinate;
      const clusterId = feature.properties?.cluster_id;
      if (typeof clusterId === "number") {
        const zoom =
          await activitiesRef.current?.getClusterExpansionZoom(clusterId);
        cameraRef.current?.flyTo({
          center: coordinates,
          duration: 550,
          easing: "fly",
          zoom: zoom ?? 14,
        });
      }
    },
    [],
  );

  const handleSearch = useCallback(async (searchText: string) => {
    setSearching(true);
    setResults([]);
    setSearchStatus("Recherche IGN + communes…");

    try {
      const result = await searchPlaces(searchText);
      setResults(result.candidates);
      setSearchStatus(
        `${result.candidates.length} résultats — IGN ${result.ignMs} ms, communes ${result.communesMs} ms, total ${result.totalMs} ms`,
      );
    } catch (error) {
      setSearchStatus(
        `Recherche indisponible (${error instanceof Error ? error.message : "erreur"})`,
      );
    } finally {
      setSearching(false);
    }
  }, []);

  const selectPlace = useCallback((place: PlaceCandidate) => {
    setPinCoordinates(place.coordinates);
    setMeetingPointLabel(place.label);
    setQuery(place.label);
    setResults([]);
    setSearchStatus(
      `${place.provider === "ign" ? "IGN" : "Communes"} — ${place.kind}`,
    );
    cameraRef.current?.flyTo({
      center: place.coordinates,
      duration: 900,
      easing: "fly",
      zoom: place.kind === "municipality" ? 12.5 : 15,
    });
  }, []);

  const handleMapLoadFailed = useCallback(() => {
    setMapStage(
      candidate === "geoapify" && !GEOAPIFY_KEY
        ? "échec attendu : clé absente"
        : "échec de chargement",
    );
  }, [candidate]);

  const handleMapLoaded = useCallback(() => {
    setMapLoadMs(Math.round(performance.now() - mapStartedAtRef.current));
    setMapStage("prête");
  }, []);

  const handleRecenter = useCallback(() => {
    cameraRef.current?.flyTo({
      center: PORNICHET,
      duration: 750,
      easing: "fly",
      pitch: 24,
      zoom: 11.8,
    });
  }, []);

  const selectOpenFreeMap = useCallback(
    () => selectCandidate("openfreemap"),
    [selectCandidate],
  );
  const selectGeoapify = useCallback(
    () => selectCandidate("geoapify"),
    [selectCandidate],
  );

  return (
    <View style={styles.root}>
      <MapView
        attribution
        attributionPosition={{ bottom: insets.bottom + 116, right: 8 }}
        compass
        compassPosition={{ right: 12, top: insets.top + 142 }}
        key={candidate}
        logo
        logoPosition={{ bottom: insets.bottom + 116, left: 8 }}
        mapStyle={mapStyle}
        onDidFailLoadingMap={handleMapLoadFailed}
        onDidFinishLoadingMap={handleMapLoaded}
        onPress={handleMapPress}
        preferredFramesPerSecond={60}
        style={StyleSheet.absoluteFill}
        testID="prototype-map"
      >
        <Camera
          initialViewState={{ center: PORNICHET, pitch: 24, zoom: 11.8 }}
          maxZoom={19}
          minZoom={5}
          ref={cameraRef}
        />

        <GeoJSONSource
          cluster
          clusterMaxZoom={15}
          clusterRadius={52}
          data={ACTIVITY_POINTS}
          id={sourceId}
          onPress={handleActivityPress}
          ref={activitiesRef}
        >
          <Layer
            filter={["has", "point_count"]}
            id={clustersId}
            paint={{
              "circle-color": "#0B6E69",
              "circle-radius": ["step", ["get", "point_count"], 19, 10, 24],
              "circle-stroke-color": "#F8FBFA",
              "circle-stroke-width": 3,
            }}
            type="circle"
          />
          <Layer
            filter={["has", "point_count"]}
            id={clusterCountsId}
            layout={{
              "text-field": ["get", "point_count_abbreviated"],
              "text-font": ["Noto Sans Bold"],
              "text-size": 12,
            }}
            paint={{ "text-color": "#FFFFFF" }}
            type="symbol"
          />
          <Layer
            filter={["!", ["has", "point_count"]]}
            id={activityPinsId}
            paint={{
              "circle-color": "#FF7A66",
              "circle-radius": 8,
              "circle-stroke-color": "#FFFFFF",
              "circle-stroke-width": 3,
            }}
            type="circle"
          />
        </GeoJSONSource>

        <ViewAnnotation
          anchor="bottom"
          draggable
          id={gpsPinId}
          lngLat={pinCoordinates}
          onDragEnd={handlePinDragEnd}
        >
          <View style={styles.gpsPin} testID="prototype-gps-pin">
            <MapPin color="#D54F3C" fill="#FF7A66" size={42} />
          </View>
        </ViewAnnotation>
      </MapView>

      <View style={[styles.topOverlay, { top: insets.top + 10 }]}>
        <SearchBar
          disabled={searching}
          onChangeText={setQuery}
          onSearch={handleSearch}
          placeholder="Ville, plage ou adresse"
          testID="prototype-search-input"
          value={query}
        />

        {results.length > 0 ? (
          <FloatingSurface gap="$xs" p="$sm">
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={styles.results}
            >
              {results.map((place, index) => (
                <PlaceResult
                  index={index}
                  key={place.id}
                  onSelect={selectPlace}
                  place={place}
                />
              ))}
            </ScrollView>
          </FloatingSurface>
        ) : null}
      </View>

      <View style={[styles.bottomOverlay, { bottom: insets.bottom + 86 }]}>
        <FloatingSurface gap="$sm" p="$sm">
          <XStack gap="$xs" items="center" justify="space-between">
            <YStack flex={1}>
              <Title size="sm">Prototype carte principale</Title>
              <Text size="sm" testID="prototype-map-status" variant="muted">
                {candidate === "openfreemap" ? "OpenFreeMap" : "Geoapify"} ·{" "}
                {mapStage}
                {mapLoadMs === null ? "" : ` · ${mapLoadMs} ms`}
              </Text>
            </YStack>
            <Button
              fullWidth={false}
              onPress={handleRecenter}
              size="sm"
              testID="prototype-recenter"
              variant="surface"
            >
              Recentrer
            </Button>
          </XStack>

          <XStack gap="$xs">
            <Button
              fullWidth={false}
              onPress={selectOpenFreeMap}
              size="sm"
              testID="prototype-candidate-openfreemap"
              variant={candidate === "openfreemap" ? "secondary" : "surface"}
            >
              A · OpenFreeMap
            </Button>
            <Button
              fullWidth={false}
              onPress={selectGeoapify}
              size="sm"
              testID="prototype-candidate-geoapify"
              variant={candidate === "geoapify" ? "secondary" : "surface"}
            >
              B · Geoapify{GEOAPIFY_KEY ? "" : " (sans clé)"}
            </Button>
          </XStack>

          <YStack gap="$xs">
            <Text size="sm" variant="muted">
              GPS Pin · {formatCoordinates(pinCoordinates)} · glisser ou toucher
              la carte
            </Text>
            <Input
              onChangeText={setMeetingPointLabel}
              placeholder="Repère manuel si IGN est indisponible"
              testID="prototype-meeting-point-input"
              value={meetingPointLabel}
            />
            <Text size="sm" testID="prototype-geocode-status" variant="muted">
              {searchStatus}
            </Text>
          </YStack>
        </FloatingSurface>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomOverlay: {
    left: 12,
    position: "absolute",
    right: 12,
    zIndex: 20,
  },
  gpsPin: {
    alignItems: "center",
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  result: {
    borderBottomColor: "rgba(19, 45, 43, 0.12)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 2,
    minHeight: 54,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  results: {
    maxHeight: 270,
  },
  root: {
    flex: 1,
  },
  topOverlay: {
    gap: 8,
    left: 12,
    position: "absolute",
    right: 12,
    zIndex: 30,
  },
});
