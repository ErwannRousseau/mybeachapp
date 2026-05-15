type BackendAppEnv = "development" | "preview" | "production";

export type BackendEnv = {
  APP_ENV: BackendAppEnv | undefined;
  APPLE_CLIENT_ID: string | undefined;
  APPLE_CLIENT_SECRET: string | undefined;
  GOOGLE_CLIENT_ID: string | undefined;
  GOOGLE_CLIENT_SECRET: string | undefined;
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
  get APPLE_CLIENT_ID() {
    return getOptionalEnvValue("APPLE_CLIENT_ID");
  },
  get APPLE_CLIENT_SECRET() {
    return getOptionalEnvValue("APPLE_CLIENT_SECRET");
  },
  get GOOGLE_CLIENT_ID() {
    return getOptionalEnvValue("GOOGLE_CLIENT_ID");
  },
  get GOOGLE_CLIENT_SECRET() {
    return getOptionalEnvValue("GOOGLE_CLIENT_SECRET");
  },
  get SITE_URL() {
    return getConvexSiteUrl();
  },
};
