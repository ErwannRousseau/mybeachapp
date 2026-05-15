import { expo } from "@better-auth/expo";
import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import type { GenericCtx } from "@convex-dev/better-auth/utils";
import { AUTH_PASSWORD_MIN_LENGTH } from "@mybeachapp/shared/auth/constants";
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";

import { components } from "../_generated/api";
import type { DataModel } from "../_generated/dataModel";
import authConfig from "../auth.config";
import { env } from "../config/env";
import schema from "./schema";

export const authComponent = createClient<DataModel, typeof schema>(
  components.betterAuth,
  {
    local: { schema },
    verbose: false,
  },
);

export function getSocialProviders(): BetterAuthOptions["socialProviders"] {
  const socialProviders: BetterAuthOptions["socialProviders"] = {};

  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    socialProviders.google = {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    };
  }

  if (env.APPLE_CLIENT_ID && env.APPLE_CLIENT_SECRET) {
    socialProviders.apple = {
      clientId: env.APPLE_CLIENT_ID,
      clientSecret: env.APPLE_CLIENT_SECRET,
    };
  }

  return socialProviders;
}

export function getTrustedOrigins() {
  return [
    "mybeachapp://",
    "mybeachapp://*",
    ...(env.APP_ENV === "development"
      ? ["exp://", "exp://**", "exp://192.168.*.*:*/**"]
      : []),
  ];
}

export function createAuthOptions(ctx: GenericCtx<DataModel>) {
  return {
    appName: "My Beach App",
    baseURL: env.SITE_URL,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: AUTH_PASSWORD_MIN_LENGTH,
    },
    plugins: [expo(), convex({ authConfig })],
    socialProviders: getSocialProviders(),
    trustedOrigins: getTrustedOrigins(),
  } satisfies BetterAuthOptions;
}

export function createSchemaAuthOptions(ctx: GenericCtx<DataModel>) {
  return {
    appName: "My Beach App",
    baseURL: "https://schema.mybeachapp.invalid",
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: AUTH_PASSWORD_MIN_LENGTH,
    },
    plugins: [expo(), convex({ authConfig })],
  } satisfies BetterAuthOptions;
}

export const options = createSchemaAuthOptions({} as GenericCtx<DataModel>);

export function createAuth(ctx: GenericCtx<DataModel>) {
  return betterAuth(createAuthOptions(ctx));
}
