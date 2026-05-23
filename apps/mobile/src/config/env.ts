import { z } from "zod";

const appEnvValues = ["development", "preview", "production"] as const;
const mapProviderValues = ["apple", "google", "placeholder"] as const;

type AppEnv = (typeof appEnvValues)[number];
type MapProvider = (typeof mapProviderValues)[number];

type MobileEnv = {
  appEnv: AppEnv;
  convexSiteUrl: string;
  convexUrl: string;
  googleIosClientId?: string | undefined;
  googleWebClientId?: string | undefined;
  mapProvider: MapProvider;
};

type EnvSource = Record<string, string | undefined>;

const publicUrlSchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z
    .url()
    .transform((value) => new URL(value).origin)
    .refine((value) => value.length > 0, "convex_url_required"),
);

const optionalPublicStringSchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().trim().min(1).optional(),
);

const convexClientUrlSchema = publicUrlSchema.refine(
  (value) => !new URL(value).hostname.endsWith(".convex.site"),
  "convex_client_url_must_use_convex_cloud",
);

const convexSiteUrlSchema = publicUrlSchema.refine(
  (value) => !new URL(value).hostname.endsWith(".convex.cloud"),
  "convex_site_url_must_use_convex_site",
);

const mobileEnvSchema = z.object({
  appEnv: z.enum(appEnvValues).catch("development"),
  convexSiteUrl: convexSiteUrlSchema,
  convexUrl: convexClientUrlSchema,
  googleIosClientId: optionalPublicStringSchema,
  googleWebClientId: optionalPublicStringSchema,
  mapProvider: z.enum(mapProviderValues).catch("placeholder"),
}) satisfies z.ZodType<MobileEnv>;

export function createMobileEnv(source: EnvSource): MobileEnv {
  return mobileEnvSchema.parse({
    appEnv: source.EXPO_PUBLIC_APP_ENV,
    convexSiteUrl: source.EXPO_PUBLIC_CONVEX_SITE_URL,
    convexUrl: source.EXPO_PUBLIC_CONVEX_URL,
    googleIosClientId: source.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    googleWebClientId: source.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    mapProvider: source.EXPO_PUBLIC_MAP_PROVIDER,
  });
}

export const env = createMobileEnv(process.env);
