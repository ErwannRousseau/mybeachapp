import { describe, expect, test } from "vitest";

import {
  hasNativeAppleAuthProviderForPlatform,
  hasNativeGoogleAuthConfigForPlatform,
  hasNativeGoogleAuthProviderForPlatform,
} from "../native-auth-config";

describe("hasNativeGoogleAuthConfigForPlatform", () => {
  test("requires the iOS client ID on iOS", () => {
    expect(
      hasNativeGoogleAuthConfigForPlatform("ios", {
        googleWebClientId: "web.apps.googleusercontent.com",
      }),
    ).toBe(false);

    expect(
      hasNativeGoogleAuthConfigForPlatform("ios", {
        googleIosClientId: "ios.apps.googleusercontent.com",
      }),
    ).toBe(true);
  });

  test("requires the web client ID on Android", () => {
    expect(
      hasNativeGoogleAuthConfigForPlatform("android", {
        googleIosClientId: "ios.apps.googleusercontent.com",
      }),
    ).toBe(false);

    expect(
      hasNativeGoogleAuthConfigForPlatform("android", {
        googleWebClientId: "web.apps.googleusercontent.com",
      }),
    ).toBe(true);
  });

  test("disables native Google auth on unsupported platforms", () => {
    expect(
      hasNativeGoogleAuthConfigForPlatform("other", {
        googleIosClientId: "ios.apps.googleusercontent.com",
        googleWebClientId: "web.apps.googleusercontent.com",
      }),
    ).toBe(false);
  });
});

describe("native social auth provider display", () => {
  test("shows Apple only on iOS", () => {
    expect(hasNativeAppleAuthProviderForPlatform("ios")).toBe(true);
    expect(hasNativeAppleAuthProviderForPlatform("android")).toBe(false);
    expect(hasNativeAppleAuthProviderForPlatform("other")).toBe(false);
  });

  test("shows Google on iOS and Android", () => {
    expect(hasNativeGoogleAuthProviderForPlatform("ios")).toBe(true);
    expect(hasNativeGoogleAuthProviderForPlatform("android")).toBe(true);
    expect(hasNativeGoogleAuthProviderForPlatform("other")).toBe(false);
  });
});
