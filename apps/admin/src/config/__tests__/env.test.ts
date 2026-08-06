import { afterAll, describe, expect, it, vi } from "vitest";

vi.stubEnv("VITE_CONVEX_SITE_URL", "https://test.convex.site");
vi.stubEnv("VITE_CONVEX_URL", "https://test.convex.cloud");

afterAll(() => vi.unstubAllEnvs());

describe("createAdminEnv", () => {
  it("accepte les deux URL publiques Convex attendues", async () => {
    // Given
    const source = {
      VITE_CONVEX_SITE_URL: "https://example.convex.site/path",
      VITE_CONVEX_URL: "https://example.convex.cloud/path",
    };

    // When
    const { createAdminEnv } = await import("../env");
    const result = createAdminEnv(source);

    // Then
    expect(result).toEqual({
      convexSiteUrl: "https://example.convex.site",
      convexUrl: "https://example.convex.cloud",
    });
  });

  it("refuse une URL de fonctions à la place du client Convex", async () => {
    // Given
    const source = {
      VITE_CONVEX_SITE_URL: "https://example.convex.site",
      VITE_CONVEX_URL: "https://example.convex.site",
    };

    // When
    const { createAdminEnv } = await import("../env");
    const parse = () => createAdminEnv(source);

    // Then
    expect(parse).toThrow();
  });
});
