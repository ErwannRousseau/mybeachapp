type AppEnv = "development" | "preview" | "production";
type MapProvider = "apple" | "google" | "placeholder";

type MobileEnv = {
  appEnv: AppEnv;
  authEnabled: boolean;
  convexUrl?: string;
  mapProvider: MapProvider;
};

type EnvSource = Record<string, string | undefined>;

const appEnvValues = ["development", "preview", "production"] as const;
const mapProviderValues = ["apple", "google", "placeholder"] as const;

function parseEnum<T extends readonly string[]>(
  value: string | undefined,
  values: T,
  fallback: T[number],
): T[number] {
  return values.includes(value ?? "") ? (value as T[number]) : fallback;
}

function parseBoolean(value: string | undefined): boolean {
  return value === "1" || value === "true";
}

function parseOptionalUrl(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  try {
    return new URL(value).toString();
  } catch {
    return undefined;
  }
}

export function createMobileEnv(source: EnvSource): MobileEnv {
  return {
    appEnv: parseEnum(source.EXPO_PUBLIC_APP_ENV, appEnvValues, "development"),
    authEnabled: parseBoolean(source.EXPO_PUBLIC_AUTH_ENABLED),
    convexUrl: parseOptionalUrl(source.EXPO_PUBLIC_CONVEX_URL),
    mapProvider: parseEnum(
      source.EXPO_PUBLIC_MAP_PROVIDER,
      mapProviderValues,
      "placeholder",
    ),
  };
}

export const mobileEnv = createMobileEnv(process.env);
