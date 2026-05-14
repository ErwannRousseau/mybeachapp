import { describe, expect, test } from "vitest";

import { createMobileEnv } from "./env";

describe("createMobileEnv", () => {
  test("uses safe defaults without public environment", () => {
    expect(createMobileEnv({})).toEqual({
      appEnv: "development",
      authEnabled: false,
      convexUrl: undefined,
      mapProvider: "placeholder",
    });
  });

  test("normalizes supported public values", () => {
    expect(
      createMobileEnv({
        EXPO_PUBLIC_APP_ENV: "production",
        EXPO_PUBLIC_AUTH_ENABLED: "true",
        EXPO_PUBLIC_CONVEX_URL: "https://beach.convex.cloud",
        EXPO_PUBLIC_MAP_PROVIDER: "apple",
      }),
    ).toEqual({
      appEnv: "production",
      authEnabled: true,
      convexUrl: "https://beach.convex.cloud/",
      mapProvider: "apple",
    });
  });
});
