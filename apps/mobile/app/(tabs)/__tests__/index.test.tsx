import type { ActivitySummary } from "@mybeachapp/shared/activities/types";
import { useQuery } from "convex/react";
import { act, createElement } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  findByProp,
  findByText,
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

vi.mock("convex/react", () => ({
  useQuery: vi.fn(),
}));

vi.mock("@maplibre/maplibre-react-native", () => ({
  Camera: ({ ref: _ref, ...props }: Record<string, unknown>) =>
    createElement("MapLibreCamera", props),
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
