export type NativeAuthPlatform = "android" | "ios" | "other";

type NativeGoogleAuthConfig = {
  googleIosClientId?: string | undefined;
  googleWebClientId?: string | undefined;
};

export function hasNativeGoogleAuthConfigForPlatform(
  platform: NativeAuthPlatform,
  config: NativeGoogleAuthConfig,
) {
  if (platform === "ios") {
    return Boolean(config.googleIosClientId);
  }

  if (platform === "android") {
    return Boolean(config.googleWebClientId);
  }

  return false;
}

export function hasNativeAppleAuthProviderForPlatform(
  platform: NativeAuthPlatform,
) {
  return platform === "ios";
}

export function hasNativeGoogleAuthProviderForPlatform(
  platform: NativeAuthPlatform,
) {
  return platform === "ios" || platform === "android";
}
