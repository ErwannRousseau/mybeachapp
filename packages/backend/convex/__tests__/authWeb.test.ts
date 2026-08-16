import { register } from "@convex-dev/better-auth/test";
import { convexTest } from "convex-test";
import { afterEach, describe, expect, test, vi } from "vitest";

import { createSchemaAuthOptions, getTrustedOrigins } from "../betterAuth/auth";
import schema from "../schema";

const modules = import.meta.glob("../**/*.ts");

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("admin web authentication", () => {
  test("trusts the configured admin site and local web development", () => {
    // Given
    vi.stubEnv("ADMIN_SITE_URL", "https://admin.example.com");

    // When
    const origins = getTrustedOrigins();

    // Then
    expect(origins).toEqual(
      expect.arrayContaining([
        "https://admin.example.com",
        "http://localhost:3000",
      ]),
    );
  });

  test("configures the cross-domain Better Auth plugin", async () => {
    // Given
    vi.stubEnv("ADMIN_SITE_URL", "https://admin.example.com");
    const t = convexTest(schema, modules);
    register(t);

    // When
    const configured = await t.run(async (ctx) => {
      const options = createSchemaAuthOptions(ctx);
      return options.plugins?.some((plugin) => plugin.id === "cross-domain");
    });

    // Then
    expect(configured).toBe(true);
  });

  test("allows credentialed CORS preflight from the configured admin site", async () => {
    // Given
    vi.stubEnv("ADMIN_SITE_URL", "https://admin.example.com");
    vi.stubEnv("SITE_URL", "https://backend.example.com");
    const t = convexTest(schema, modules);
    register(t);

    // When
    const response = await t.fetch("/api/auth/get-session", {
      headers: {
        "access-control-request-method": "GET",
        origin: "https://admin.example.com",
      },
      method: "OPTIONS",
    });

    // Then
    expect(response.headers.get("access-control-allow-origin")).toBe(
      "https://admin.example.com",
    );
    expect(response.headers.get("access-control-allow-credentials")).toBe(
      "true",
    );
  });
});
