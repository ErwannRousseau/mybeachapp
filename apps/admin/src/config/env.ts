import { z } from "zod";

type AdminEnv = {
  readonly convexSiteUrl: string;
  readonly convexUrl: string;
};

type EnvSource = Record<string, string | boolean | undefined>;

const publicUrlSchema = z
  .string()
  .url()
  .transform((value) => new URL(value).origin);

const adminEnvSchema = z.object({
  convexSiteUrl: publicUrlSchema.refine(
    (value) => !new URL(value).hostname.endsWith(".convex.cloud"),
    "convex_site_url_must_use_convex_site",
  ),
  convexUrl: publicUrlSchema.refine(
    (value) => !new URL(value).hostname.endsWith(".convex.site"),
    "convex_url_must_use_convex_cloud",
  ),
}) satisfies z.ZodType<AdminEnv>;

export function createAdminEnv(source: EnvSource): AdminEnv {
  return adminEnvSchema.parse({
    convexSiteUrl: source.VITE_CONVEX_SITE_URL,
    convexUrl: source.VITE_CONVEX_URL,
  });
}

export const env = createAdminEnv(import.meta.env);
