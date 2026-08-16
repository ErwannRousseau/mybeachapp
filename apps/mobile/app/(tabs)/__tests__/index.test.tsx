import type { ActivitySummary } from "@mybeachapp/shared/activities/types";
import { useQuery } from "convex/react";
import { act, createElement, useImperativeHandle } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  findByProp,
  findByText,
  findByType,
  queryByText,
  renderWithTamagui,
} from "../../../test/render-with-tamagui";
import HomeScreen from "../index";

const maplibre = vi.hoisted(() => ({
  easeTo: vi.fn(),
}));

vi.mock("expo-router", () => ({
  Stack: { Screen: () => null },
}));

vi.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ bottom: 34, left: 0, right: 0, top: 47 }),
}));

vi.mock("convex/react", () => ({
  useQuery: vi.fn(),
}));

vi.mock("@maplibre/maplibre-react-native", () => ({
  Camera: function MockCamera({
    ref,
    ...props
  }: Record<string, unknown> & { ref?: React.Ref<unknown> }) {
    useImperativeHandle(ref, () => ({ easeTo: maplibre.easeTo }));
    return createElement("MapLibreCamera", props);
  },
  GeoJSONSource: ({
    children,
    ref: _ref,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) =>
    createElement("MapLibreGeoJSONSource", props, children),
  Layer: (props: Record<string, unknown>) =>
    createElement("MapLibreLayer", props),
  Map: ({ children, ...props }: React.PropsWithChildren) =>
    createElement("MapLibreMap", props, children),
  Marker: ({ children, ...props }: React.PropsWithChildren) =>
    createElement("MapLibreMarker", props, children),
}));

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
  vi.mocked(useQuery).mockReset();
  vi.mocked(useQuery).mockImplementation((...args) =>
    args[1] === "skip" ? undefined : [openActivity],
  );
});

afterEach(() => {
  maplibre.easeTo.mockReset();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("HomeScreen", () => {
  test("opens on the keyless Liberty map inside the real tab shell", async () => {
    const root = await renderWithTamagui(<HomeScreen />);
    const map = findByType(root, "MapLibreMap");
    const camera = findByType(root, "MapLibreCamera");

    expect(map.props).toMatchObject({
      attribution: true,
      logo: true,
      mapStyle: "https://tiles.openfreemap.org/styles/liberty",
    });
    expect(camera.props.initialViewState).toEqual({
      center: [-2.3242, 47.2591],
      zoom: 11.5,
    });
    expect(findByProp(root, "placeholder").props.placeholder).toBe(
      "Ville, plage ou adresse",
    );
    expect(queryByText(root, "Carte prête pour les activités proches.")).toBe(
      undefined,
    );
  });

  test("re-centers the map and positions a provisional GPS Pin", async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "fetch",
      vi.fn((input: string | URL | Request) => {
        const url = new URL(String(input));
        const value =
          url.hostname === "geo.api.gouv.fr"
            ? [
                {
                  centre: {
                    coordinates: [-2.3225, 47.2599],
                    type: "Point",
                  },
                  code: "44132",
                  departement: {
                    code: "44",
                    nom: "Loire-Atlantique",
                  },
                  nom: "Pornichet",
                },
              ]
            : { features: [], type: "FeatureCollection" };

        return Promise.resolve({
          json: async () => value,
          ok: true,
          status: 200,
        } as Response);
      }),
    );
    const root = await renderWithTamagui(<HomeScreen />);
    const input = findByProp(root, "placeholder");

    await act(async () =>
      input.props.onChange({
        nativeEvent: { text: "Pornichet" },
        target: { value: "Pornichet" },
      }),
    );
    await act(async () => vi.advanceTimersByTimeAsync(300));
    const result = root.container.queryAll(
      (node) =>
        node.props.accessibilityLabel === "Choisir Pornichet, Loire-Atlantique",
    )[0];
    expect(result).toBeDefined();

    await act(async () =>
      (result.props.onPress ?? result.props.onClick)({
        stopPropagation: vi.fn(),
      }),
    );

    expect(maplibre.easeTo).toHaveBeenCalledWith({
      center: [-2.3225, 47.2599],
      duration: 600,
      zoom: 14,
    });
    expect(findByType(root, "MapLibreMarker").props.lngLat).toEqual([
      -2.3225, 47.2599,
    ]);
    expect(findByText(root, "GPS")).toBeDefined();
  });

  test("queries only the latest settled viewport after the debounce", async () => {
    vi.useFakeTimers();
    const root = await renderWithTamagui(<HomeScreen />);
    const map = findByType(root, "MapLibreMap");

    expect(vi.mocked(useQuery).mock.calls.at(-1)?.[1]).toBe("skip");

    act(() => {
      map.props.onRegionDidChange({
        nativeEvent: { bounds: [-2.5, 47.2, -2.3, 47.35] },
      });
      map.props.onRegionDidChange({
        nativeEvent: { bounds: [-2.45, 47.21, -2.31, 47.34] },
      });
      vi.advanceTimersByTime(299);
    });
    expect(vi.mocked(useQuery).mock.calls.at(-1)?.[1]).toBe("skip");

    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    expect(vi.mocked(useQuery).mock.calls.at(-1)?.[1]).toEqual({
      east: -2.31,
      north: 47.34,
      south: 47.21,
      west: -2.45,
    });
  });

  test("opens an activity preview without propagating its press", async () => {
    vi.mocked(useQuery).mockReturnValue([openActivity]);
    const root = await renderWithTamagui(<HomeScreen />);
    const map = findByType(root, "MapLibreMap");
    const source = findByType(root, "MapLibreGeoJSONSource");
    const stopPropagation = vi.fn();

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
        stopPropagation,
      });
    });

    expect(stopPropagation).toHaveBeenCalledOnce();
    expect(findByText(root, "Beach-volley")).toBeTruthy();
    expect(findByText(root, "2 / 8")).toBeTruthy();

    act(() => map.props.onPress());
    expect(queryByText(root, "Beach-volley")).toBeUndefined();
  });
});
