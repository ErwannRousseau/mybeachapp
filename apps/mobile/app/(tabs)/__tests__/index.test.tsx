import * as Location from "expo-location";
import { act, createElement } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import {
  findByProp,
  findByType,
  queryByText,
  renderWithTamagui,
} from "../../../test/render-with-tamagui";
import HomeScreen from "../index";

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

vi.mock("@maplibre/maplibre-react-native", () => ({
  Camera: (props: Record<string, unknown>) =>
    createElement("MapLibreCamera", props),
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

    await act(async () => {
      findByProp(root, "onClick").props.onClick({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      });
      await Promise.resolve();
      await Promise.resolve();
    });

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

    await act(async () => {
      findByProp(root, "onClick").props.onClick({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      });
      await Promise.resolve();
    });

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

    await act(async () => {
      findByProp(root, "onClick").props.onClick({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      });
      await Promise.resolve();
      await Promise.resolve();
    });

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
      await act(async () => {
        findByProp(root, "onClick").props.onClick({
          preventDefault: vi.fn(),
          stopPropagation: vi.fn(),
        });
        await Promise.resolve();
      });

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
});
