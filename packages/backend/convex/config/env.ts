type BackendAppEnv = "development" | "preview" | "production";

export type BackendEnv = {
  APP_ENV: BackendAppEnv | undefined;
  APPLE_APP_BUNDLE_IDENTIFIER: string | undefined;
  GOOGLE_IOS_CLIENT_ID: string | undefined;
  GOOGLE_WEB_CLIENT_ID: string | undefined;
  SITE_URL: string;
};

function getOptionalEnvValue(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function getAppEnv() {
  const value = getOptionalEnvValue("APP_ENV");

  return value === "development" ||
    value === "preview" ||
    value === "production"
    ? value
    : undefined;
}

function getConvexSiteUrl() {
  const siteUrl = getOptionalEnvValue("SITE_URL");

  if (siteUrl) {
    return siteUrl;
  }

  return (
    getOptionalEnvValue("CONVEX_CLOUD_URL")?.replace(
      ".convex.cloud",
      ".convex.site",
    ) ?? ""
  );
}

export const env: BackendEnv = {
  get APP_ENV() {
    return getAppEnv();
  },
  get APPLE_APP_BUNDLE_IDENTIFIER() {
    return getOptionalEnvValue("APPLE_APP_BUNDLE_IDENTIFIER");
  },
  get GOOGLE_IOS_CLIENT_ID() {
    return getOptionalEnvValue("GOOGLE_IOS_CLIENT_ID");
  },
  get GOOGLE_WEB_CLIENT_ID() {
    return getOptionalEnvValue("GOOGLE_WEB_CLIENT_ID");
  },
  get SITE_URL() {
    return getConvexSiteUrl();
  },
};
