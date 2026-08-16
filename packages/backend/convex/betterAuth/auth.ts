import { expo } from "@better-auth/expo";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import type { GenericCtx } from "@convex-dev/better-auth/utils";
import {
  AUTH_EMAIL_OTP_EXPIRES_IN_SECONDS,
  AUTH_EMAIL_OTP_LENGTH,
  AUTH_EMAIL_OTP_RESEND_AFTER_SECONDS,
} from "@mybeachapp/shared/auth/constants";
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins/email-otp";

import type { DataModel } from "../_generated/dataModel";
import authConfig from "../auth.config";
import { env } from "../config/env";
import { getAppleUserInfoFromIdToken, providerClientId } from "../lib/oauth";
import { authComponent } from "./component";
import { sendAuthEmailOtp } from "./emailOtp";

export function getSocialProviders(): BetterAuthOptions["socialProviders"] {
  const socialProviders: BetterAuthOptions["socialProviders"] = {};
  const googleClientId = providerClientId([
    env.GOOGLE_WEB_CLIENT_ID,
    env.GOOGLE_IOS_CLIENT_ID,
  ]);

  if (googleClientId) {
    socialProviders.google = {
      clientId: googleClientId,
    };
  }

  if (env.APPLE_APP_BUNDLE_IDENTIFIER) {
    socialProviders.apple = {
      appBundleIdentifier: env.APPLE_APP_BUNDLE_IDENTIFIER,
      clientId: env.APPLE_APP_BUNDLE_IDENTIFIER,
      getUserInfo: getAppleUserInfoFromIdToken,
    };
  }

  return socialProviders;
}

export function getTrustedOrigins() {
  return [
    "mybeachapp://",
    "mybeachapp://*",
    "https://appleid.apple.com",
    env.ADMIN_SITE_URL,
    "http://localhost:3000",
    ...(env.APP_ENV === "development"
      ? ["exp://", "exp://**", "exp://192.168.*.*:*/**"]
      : []),
  ];
}

function getPlugins() {
  return [
    expo(),
    crossDomain({ siteUrl: env.ADMIN_SITE_URL }),
    emailOTP({
      allowedAttempts: 5,
      expiresIn: AUTH_EMAIL_OTP_EXPIRES_IN_SECONDS,
      otpLength: AUTH_EMAIL_OTP_LENGTH,
      resendStrategy: "reuse",
      sendVerificationOTP: sendAuthEmailOtp,
      storeOTP: "encrypted",
    }),
    convex({ authConfig }),
  ] satisfies BetterAuthOptions["plugins"];
}

export function createAuthOptions(ctx: GenericCtx<DataModel>) {
  return {
    appName: "My Beach App",
    baseURL: env.SITE_URL,
    database: authComponent.adapter(ctx),
    plugins: getPlugins(),
    rateLimit: {
      customRules: {
        "/email-otp/send-verification-otp": {
          max: 1,
          window: AUTH_EMAIL_OTP_RESEND_AFTER_SECONDS,
        },
      },
      enabled: true,
      max: 30,
      window: 60,
    },
    socialProviders: getSocialProviders(),
    trustedOrigins: getTrustedOrigins(),
  } satisfies BetterAuthOptions;
}

export function createSchemaAuthOptions(ctx: GenericCtx<DataModel>) {
  return {
    appName: "My Beach App",
    baseURL: "https://schema.mybeachapp.invalid",
    database: authComponent.adapter(ctx),
    plugins: getPlugins(),
    rateLimit: {
      customRules: {
        "/email-otp/send-verification-otp": {
          max: 1,
          window: AUTH_EMAIL_OTP_RESEND_AFTER_SECONDS,
        },
      },
      enabled: true,
      max: 30,
      window: 60,
    },
  } satisfies BetterAuthOptions;
}

export const options = createSchemaAuthOptions({} as GenericCtx<DataModel>);

export function createAuth(ctx: GenericCtx<DataModel>) {
  return betterAuth(createAuthOptions(ctx));
}
