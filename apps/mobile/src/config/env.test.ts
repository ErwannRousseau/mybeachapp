import { describe, expect, test } from "vitest";

process.env.EXPO_PUBLIC_CONVEX_URL = "https://beach.convex.cloud";
process.env.EXPO_PUBLIC_CONVEX_SITE_URL = "https://beach.convex.site";

const { createMobileEnv, env } = await import("./env");

describe("createMobileEnv", () => {
  test("exposes parsed process env", () => {
    expect(env.convexUrl).toBe("https://beach.convex.cloud");
    expect(env.convexSiteUrl).toBe("https://beach.convex.site");
  });

  test("throws when Convex URL is missing", () => {
    expect(() => createMobileEnv({})).toThrow();
  });

  test("throws when Convex URL is invalid", () => {
    expect(() =>
      createMobileEnv({
        EXPO_PUBLIC_CONVEX_SITE_URL: "https://beach.convex.site",
        EXPO_PUBLIC_CONVEX_URL: "not-a-url",
      }),
    ).toThrow();
  });

  test("throws when Convex client URL points at the HTTP site deployment", () => {
    expect(() =>
      createMobileEnv({
        EXPO_PUBLIC_CONVEX_SITE_URL: "https://beach.convex.site",
        EXPO_PUBLIC_CONVEX_URL: "https://beach.convex.site",
      }),
    ).toThrow("convex_client_url_must_use_convex_cloud");
  });

  test("throws when Convex site URL points at the WebSocket deployment", () => {
    expect(() =>
      createMobileEnv({
        EXPO_PUBLIC_CONVEX_SITE_URL: "https://beach.convex.cloud",
        EXPO_PUBLIC_CONVEX_URL: "https://beach.convex.cloud",
      }),
    ).toThrow("convex_site_url_must_use_convex_site");
  });

  test("normalizes supported public values", () => {
    expect(
      createMobileEnv({
        EXPO_PUBLIC_APP_ENV: "production",
        EXPO_PUBLIC_CONVEX_SITE_URL: "https://beach.convex.site",
        EXPO_PUBLIC_CONVEX_URL: "https://beach.convex.cloud",
        EXPO_PUBLIC_MAP_PROVIDER: "apple",
      }),
    ).toEqual({
      appEnv: "production",
      convexSiteUrl: "https://beach.convex.site",
      convexUrl: "https://beach.convex.cloud",
      mapProvider: "apple",
    });
  });

  test("uses safe defaults for optional public values", () => {
    expect(
      createMobileEnv({
        EXPO_PUBLIC_CONVEX_SITE_URL: "https://beach.convex.site",
        EXPO_PUBLIC_CONVEX_URL: "https://beach.convex.cloud",
      }),
    ).toEqual({
      appEnv: "development",
      convexSiteUrl: "https://beach.convex.site",
      convexUrl: "https://beach.convex.cloud",
      mapProvider: "placeholder",
    });
  });
});
