import type { ActivitySummary } from "@mybeachapp/shared/activities/types";
import { useQuery } from "convex/react";
import * as Location from "expo-location";
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

vi.mock("expo-location", () => ({
  Accuracy: { Balanced: 3 },
  getCurrentPositionAsync: vi.fn(),
  getForegroundPermissionsAsync: vi.fn(),
  PermissionStatus: {
    DENIED: "denied",
    GRANTED: "granted",
    UNDETERMINED: "undetermined",
  },
  requestForegroundPermissionsAsync: vi.fn(),
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

function locationPermission(
  status: Location.PermissionStatus,
): Location.LocationPermissionResponse {
  return {
    canAskAgain: status !== Location.PermissionStatus.DENIED,
    expires: "never",
    granted: status === Location.PermissionStatus.GRANTED,
    status,
  };
}

async function pressLocate(
  root: Awaited<ReturnType<typeof renderWithTamagui>>,
) {
  await act(async () => {
    findByProp(root, "onClick").props.onClick({
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    });
    await Promise.resolve();
    await Promise.resolve();
  });
}

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
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
    expect(queryByText(root, "Me localiser")).toBeDefined();
    expect(Location.getForegroundPermissionsAsync).not.toHaveBeenCalled();
    expect(Location.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
    expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
  });

  test("requests foreground permission and recenters on the device position", async () => {
    vi.mocked(Location.getForegroundPermissionsAsync).mockResolvedValue(
      locationPermission(Location.PermissionStatus.UNDETERMINED),
    );
    vi.mocked(Location.requestForegroundPermissionsAsync).mockResolvedValue(
      locationPermission(Location.PermissionStatus.GRANTED),
    );
    vi.mocked(Location.getCurrentPositionAsync).mockResolvedValue({
      coords: {
        accuracy: 8,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        latitude: 47.2735,
        longitude: -2.2137,
        speed: null,
      },
      timestamp: 1,
    });
    const root = await renderWithTamagui(<HomeScreen />);

    await pressLocate(root);

    expect(Location.getForegroundPermissionsAsync).toHaveBeenCalledOnce();
    expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalledOnce();
    expect(Location.getCurrentPositionAsync).toHaveBeenCalledOnce();
    expect(findByType(root, "MapLibreCamera").props).toMatchObject({
      center: [-2.2137, 47.2735],
      zoom: 14,
    });
    expect(findByType(root, "MapLibreMarker").props.lngLat).toEqual([
      -2.2137, 47.2735,
    ]);
    expect(queryByText(root, "Position affichée sur la carte.")).toBeDefined();
  });

  test("keeps Pilot Zone discovery usable when permission is denied", async () => {
    vi.mocked(Location.getForegroundPermissionsAsync).mockResolvedValue(
      locationPermission(Location.PermissionStatus.DENIED),
    );
    const root = await renderWithTamagui(<HomeScreen />);

    await pressLocate(root);

    expect(Location.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
    expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
    expect(findByType(root, "MapLibreCamera").props.initialViewState).toEqual({
      center: [-2.3242, 47.2591],
      zoom: 11.5,
    });
    expect(findByProp(root, "placeholder").props.placeholder).toBe(
      "Ville, plage ou adresse",
    );
    expect(
      queryByText(root, "Localisation refusée. Recherche un lieu."),
    ).toBeDefined();
  });

  test("keeps Pilot Zone discovery usable when location fails", async () => {
    vi.mocked(Location.getForegroundPermissionsAsync).mockResolvedValue(
      locationPermission(Location.PermissionStatus.GRANTED),
    );
    vi.mocked(Location.getCurrentPositionAsync).mockRejectedValue(
      new Error("Location unavailable"),
    );
    const root = await renderWithTamagui(<HomeScreen />);

    await pressLocate(root);

    expect(Location.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
    expect(findByType(root, "MapLibreCamera").props.initialViewState).toEqual({
      center: [-2.3242, 47.2591],
      zoom: 11.5,
    });
    expect(findByProp(root, "placeholder").props.placeholder).toBe(
      "Ville, plage ou adresse",
    );
    expect(
      queryByText(root, "Position indisponible. Recherche un lieu."),
    ).toBeDefined();
  });

  test("stops locating when the device position never resolves", async () => {
    vi.useFakeTimers();
    vi.mocked(Location.getForegroundPermissionsAsync).mockResolvedValue(
      locationPermission(Location.PermissionStatus.GRANTED),
    );
    vi.mocked(Location.getCurrentPositionAsync).mockReturnValue(
      new Promise(() => undefined),
    );
    const root = await renderWithTamagui(<HomeScreen />);

    try {
      await pressLocate(root);

      expect(queryByText(root, "Localisation…")).toBeDefined();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(10_000);
      });

      expect(queryByText(root, "Localisation…")).toBeUndefined();
      expect(
        queryByText(root, "Position indisponible. Recherche un lieu."),
      ).toBeDefined();
    } finally {
      vi.useRealTimers();
    }
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
