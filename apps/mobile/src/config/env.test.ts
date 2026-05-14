import { describe, expect, test } from "vitest";

process.env.EXPO_PUBLIC_CONVEX_URL = "https://beach.convex.cloud";

const { createMobileEnv, env } = await import("./env");

describe("createMobileEnv", () => {
  test("exposes parsed process env", () => {
    expect(env.convexUrl).toBe("https://beach.convex.cloud/");
  });

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
        EXPO_PUBLIC_CONVEX_URL: "https://beach.convex.cloud",
        EXPO_PUBLIC_MAP_PROVIDER: "apple",
      }),
    ).toEqual({
      appEnv: "production",
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
      convexUrl: "https://beach.convex.cloud/",
      mapProvider: "placeholder",
    });
  });
});
