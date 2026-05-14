import { describe, expect, test } from "vitest";

import { createMobileEnv } from "./env";

describe("createMobileEnv", () => {
  test("throws when Convex URL is missing", () => {
    expect(() => createMobileEnv({})).toThrow();
  });

  test("throws when Convex URL is invalid", () => {
    expect(() =>
      createMobileEnv({
        EXPO_PUBLIC_CONVEX_URL: "not-a-url",
      }),
    ).toThrow();
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

  test("uses safe defaults for optional public values", () => {
    expect(
      createMobileEnv({
        EXPO_PUBLIC_CONVEX_URL: "https://beach.convex.cloud",
      }),
    ).toEqual({
      appEnv: "development",
      authEnabled: false,
      convexUrl: "https://beach.convex.cloud/",
      mapProvider: "placeholder",
    });
  });
});
