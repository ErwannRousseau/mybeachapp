import type { CameraRef } from "@maplibre/maplibre-react-native";
import type { ActivitySummary } from "@mybeachapp/shared/activities/types";
import { act, createElement } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import {
  findByType,
  renderWithTamagui,
} from "../../../../../test/render-with-tamagui";
import { ActivityMapLayer } from "../activity-map-layer";

const { getClusterExpansionZoom } = vi.hoisted(() => ({
  getClusterExpansionZoom: vi.fn(),
}));

vi.mock("@maplibre/maplibre-react-native", async () => {
  const React = await import("react");

  return {
    GeoJSONSource: ({
      children,
      ref,
      ...props
    }: React.PropsWithChildren<
      Record<string, unknown> & { ref?: React.Ref<unknown> }
    >) => {
      React.useImperativeHandle(ref as React.Ref<unknown>, () => ({
        getClusterExpansionZoom,
      }));

      return createElement("MapLibreGeoJSONSource", props, children);
    },
    Layer: (props: Record<string, unknown>) =>
      createElement("MapLibreLayer", props),
  };
});

const openActivity: ActivitySummary = {
  category: "ball_sport",
  currentParticipantsCount: 2,
  id: "activity-open",
  location: {
    addressLabel: "Plage de Bonne-Source",
    latitude: 47.266,
    longitude: -2.344,
    placeName: "Pornichet",
  },
  maxParticipants: 8,
  startDateTime: Date.now() + 3_600_000,
  status: "open",
  title: "Beach-volley",
};

beforeEach(() => {
  getClusterExpansionZoom.mockReset();
  getClusterExpansionZoom.mockResolvedValue(14);
});

describe("ActivityMapLayer", () => {
  test("renders open activities as a clustered GeoJSON source", async () => {
    const root = await renderWithTamagui(
      <ActivityMapLayer
        activities={[
          openActivity,
          { ...openActivity, id: "cancelled", status: "cancelled" },
          { ...openActivity, id: "finished", status: "finished" },
        ]}
        cameraRef={{ current: null }}
        onActivityPress={vi.fn()}
      />,
    );
    const source = findByType(root, "MapLibreGeoJSONSource");
    const data = source.props.data as GeoJSON.FeatureCollection;

    expect(source.props).toMatchObject({
      cluster: true,
      clusterRadius: 50,
    });
    expect(data.features).toHaveLength(1);
    expect(data.features[0]).toMatchObject({
      geometry: { coordinates: [-2.344, 47.266], type: "Point" },
      properties: { activityId: "activity-open" },
    });
    expect(
      root.container.queryAll((node) => node.type === "MapLibreLayer"),
    ).toHaveLength(4);
  });

  test("isolates cluster and activity presses from the map", async () => {
    const easeTo = vi.fn();
    const onActivityPress = vi.fn();
    const cameraRef = {
      current: { easeTo } as unknown as CameraRef,
    };
    const root = await renderWithTamagui(
      <ActivityMapLayer
        activities={[openActivity]}
        cameraRef={cameraRef}
        onActivityPress={onActivityPress}
      />,
    );
    const source = findByType(root, "MapLibreGeoJSONSource");
    const stopClusterPropagation = vi.fn();

    await act(async () => {
      await source.props.onPress({
        nativeEvent: {
          features: [
            {
              geometry: { coordinates: [-2.34, 47.27], type: "Point" },
              properties: { cluster: true, cluster_id: 7 },
              type: "Feature",
            },
          ],
        },
        stopPropagation: stopClusterPropagation,
      });
    });

    expect(stopClusterPropagation).toHaveBeenCalledOnce();
    expect(getClusterExpansionZoom).toHaveBeenCalledWith(7);
    expect(easeTo).toHaveBeenCalledWith({
      center: [-2.34, 47.27],
      duration: 300,
      zoom: 14,
    });

    const stopActivityPropagation = vi.fn();
    await act(async () => {
      await source.props.onPress({
        nativeEvent: {
          features: [
            {
              geometry: {
                coordinates: [-2.344, 47.266],
                type: "Point",
              },
              properties: { activityId: "activity-open" },
              type: "Feature",
            },
          ],
        },
        stopPropagation: stopActivityPropagation,
      });
    });

    expect(stopActivityPropagation).toHaveBeenCalledOnce();
    expect(onActivityPress).toHaveBeenCalledWith(openActivity);
  });
});
