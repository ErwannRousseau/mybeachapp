import { act, createElement, useImperativeHandle } from "react";
import { afterEach, describe, expect, test, vi } from "vitest";

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

vi.mock("@maplibre/maplibre-react-native", () => ({
  Camera: function MockCamera({
    ref,
    ...props
  }: Record<string, unknown> & { ref?: React.Ref<unknown> }) {
    useImperativeHandle(ref, () => ({ easeTo: maplibre.easeTo }));
    return createElement("MapLibreCamera", props);
  },
  Map: ({ children, ...props }: React.PropsWithChildren) =>
    createElement("MapLibreMap", props, children),
  Marker: ({ children, ...props }: React.PropsWithChildren) =>
    createElement("MapLibreMarker", props, children),
}));

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
});
