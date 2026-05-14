import { z } from "zod";

const appEnvValues = ["development", "preview", "production"] as const;
const mapProviderValues = ["apple", "google", "placeholder"] as const;

type AppEnv = (typeof appEnvValues)[number];
type MapProvider = (typeof mapProviderValues)[number];

type MobileEnv = {
  appEnv: AppEnv;
  authEnabled: boolean;
  convexUrl?: string;
  mapProvider: MapProvider;
};

type EnvSource = Record<string, string | undefined>;

const publicUrlSchema = z
  .preprocess(
    (value) => (value === "" ? undefined : value),
    z
      .url()
      .transform((value) => new URL(value).toString())
      .optional(),
  )
  .catch(undefined);

const mobileEnvSchema = z.object({
  appEnv: z.enum(appEnvValues).catch("development"),
  authEnabled: z
    .string()
    .transform((value) => value === "1" || value === "true")
    .catch(false),
  convexUrl: publicUrlSchema,
  mapProvider: z.enum(mapProviderValues).catch("placeholder"),
}) satisfies z.ZodType<MobileEnv>;

export function createMobileEnv(source: EnvSource): MobileEnv {
  return mobileEnvSchema.parse({
    appEnv: source.EXPO_PUBLIC_APP_ENV,
    authEnabled: source.EXPO_PUBLIC_AUTH_ENABLED,
    convexUrl: source.EXPO_PUBLIC_CONVEX_URL,
    mapProvider: source.EXPO_PUBLIC_MAP_PROVIDER,
  });
}

export const mobileEnv = createMobileEnv(process.env);
