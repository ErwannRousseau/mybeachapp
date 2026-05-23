import { describe, expect, test } from "vitest";

import { getAppleUserInfoFromIdToken, providerClientId } from "./oauth";

function encodeJwtPayload(payload: Record<string, unknown>) {
  const encodedPayload = btoa(JSON.stringify(payload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `header.${encodedPayload}.signature`;
}

describe("providerClientId", () => {
  test("returns undefined when no client IDs are configured", () => {
    expect(providerClientId([undefined, ""])).toBeUndefined();
  });

  test("deduplicates configured client IDs", () => {
    expect(providerClientId(["client-id", "client-id"])).toBe("client-id");
    expect(providerClientId(["web-id", "ios-id"])).toEqual([
      "web-id",
      "ios-id",
    ]);
  });
});

describe("getAppleUserInfoFromIdToken", () => {
  test("uses the email claim from the Apple identity token", async () => {
    expect(
      await getAppleUserInfoFromIdToken({
        idToken: encodeJwtPayload({
          email: "token@example.com",
          email_verified: "true",
          sub: "apple-user",
        }),
      }),
    ).toMatchObject({
      user: {
        email: "token@example.com",
        emailVerified: true,
        id: "apple-user",
      },
    });
  });

  test("falls back to the native Apple credential email", async () => {
    expect(
      await getAppleUserInfoFromIdToken({
        idToken: encodeJwtPayload({
          email_verified: true,
          sub: "apple-user",
        }),
        user: {
          email: "credential@example.com",
          name: {
            firstName: "Beach",
            lastName: "User",
          },
        },
      }),
    ).toMatchObject({
      data: {
        email: "credential@example.com",
        name: "Beach User",
      },
      user: {
        email: "credential@example.com",
        emailVerified: true,
        id: "apple-user",
        name: "Beach User",
      },
    });
  });
});
