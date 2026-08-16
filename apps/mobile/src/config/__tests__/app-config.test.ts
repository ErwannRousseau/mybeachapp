import { describe, expect, test } from "vitest";

import config from "../../../app.config";

const locationWhenInUsePermission =
  "Autorise My Beach App à utiliser ta position pour centrer la carte.";

describe("native app configuration", () => {
  test("localizes the iOS foreground-location permission", () => {
    expect(config.locales).toEqual({
      fr: {
        ios: {
          NSLocationWhenInUseUsageDescription: locationWhenInUsePermission,
        },
      },
    });
    expect(config.plugins).toContainEqual([
      "expo-location",
      expect.objectContaining({ locationWhenInUsePermission }),
    ]);
  });
});
