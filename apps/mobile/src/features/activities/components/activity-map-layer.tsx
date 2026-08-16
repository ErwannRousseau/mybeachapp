import {
  type CameraRef,
  type FilterSpecification,
  GeoJSONSource,
  type GeoJSONSourceRef,
  Layer,
  type PressEventWithFeatures,
} from "@maplibre/maplibre-react-native";
import type { ActivitySummary } from "@mybeachapp/shared/activities/types";
import { useCallback, useId, useMemo, useRef } from "react";
import type { NativeSyntheticEvent } from "react-native";
import { useTheme } from "tamagui";

const CLUSTER_FILTER: FilterSpecification = ["has", "point_count"];
const ACTIVITY_FILTER: FilterSpecification = ["!", ["has", "point_count"]];

type ActivityMapLayerProps = {
  activities: ActivitySummary[];
  cameraRef: React.RefObject<CameraRef | null>;
  onActivityPress: (activity: ActivitySummary) => void;
};

export function ActivityMapLayer({
  activities,
  cameraRef,
  onActivityPress,
}: ActivityMapLayerProps) {
  const id = useId();
  const sourceRef = useRef<GeoJSONSourceRef>(null);
  const theme = useTheme();
  const visibleActivities = useMemo(
    () => activities.filter(({ status }) => status === "open"),
    [activities],
  );
  const data = useMemo<GeoJSON.FeatureCollection<GeoJSON.Point>>(
    () => ({
      features: visibleActivities.map((activity) => ({
        geometry: {
          coordinates: [
            activity.location.longitude,
            activity.location.latitude,
          ],
          type: "Point",
        },
        properties: {
          activityId: activity.id,
          pinLabel: activity.title.slice(0, 1).toUpperCase(),
        },
        type: "Feature",
      })),
      type: "FeatureCollection",
    }),
    [visibleActivities],
  );

  const handlePress = useCallback(
    async (event: NativeSyntheticEvent<PressEventWithFeatures>) => {
      event.stopPropagation();

      const feature = event.nativeEvent.features[0];
      if (feature?.geometry.type !== "Point") {
        return;
      }

      const [longitude, latitude] = feature.geometry.coordinates;
      const clusterId = feature.properties?.cluster_id;
      if (
        typeof clusterId === "number" &&
        typeof longitude === "number" &&
        typeof latitude === "number"
      ) {
        const zoom =
          await sourceRef.current?.getClusterExpansionZoom(clusterId);
        if (typeof zoom === "number") {
          cameraRef.current?.easeTo({
            center: [longitude, latitude],
            duration: 300,
            zoom,
          });
        }
        return;
      }

      const activityId = feature.properties?.activityId;
      const activity = visibleActivities.find(({ id }) => id === activityId);
      if (activity) {
        onActivityPress(activity);
      }
    },
    [cameraRef, onActivityPress, visibleActivities],
  );

  return (
    <GeoJSONSource
      cluster
      clusterRadius={50}
      data={data}
      id={`open-activities-${id}`}
      onPress={handlePress}
      ref={sourceRef}
    >
      <Layer
        filter={CLUSTER_FILTER}
        id={`activity-clusters-${id}`}
        paint={{
          "circle-color": theme.accent.val,
          "circle-radius": 24,
          "circle-stroke-color": theme.surface.val,
          "circle-stroke-width": 2,
        }}
        type="circle"
      />
      <Layer
        filter={CLUSTER_FILTER}
        id={`activity-cluster-count-${id}`}
        layout={{
          "text-field": ["get", "point_count_abbreviated"],
          "text-size": 13,
        }}
        paint={{ "text-color": theme.foreground.val }}
        type="symbol"
      />
      <Layer
        filter={ACTIVITY_FILTER}
        id={`activity-pins-${id}`}
        paint={{
          "circle-color": theme.success.val,
          "circle-radius": 22,
          "circle-stroke-color": theme.surface.val,
          "circle-stroke-width": 2,
        }}
        type="circle"
      />
      <Layer
        filter={ACTIVITY_FILTER}
        id={`activity-pin-labels-${id}`}
        layout={{ "text-field": ["get", "pinLabel"], "text-size": 13 }}
        paint={{ "text-color": theme.foreground.val }}
        type="symbol"
      />
    </GeoJSONSource>
  );
}
