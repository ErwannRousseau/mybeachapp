import { createElement } from "react";
import { describe, expect, test, vi } from "vitest";

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

vi.mock("@maplibre/maplibre-react-native", () => ({
  Camera: (props: Record<string, unknown>) =>
    createElement("MapLibreCamera", props),
  Map: ({ children, ...props }: React.PropsWithChildren) =>
    createElement("MapLibreMap", props, children),
}));

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
});
