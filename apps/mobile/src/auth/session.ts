import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { env } from "../config/env";
import { isAndroid, isIos } from "../lib/platform";
import { authClient } from "./auth-client";
import { emailOtpAuthCapability } from "./email-otp-capability";
import {
  hasNativeAppleAuthProviderForPlatform,
  hasNativeGoogleAuthConfigForPlatform,
  hasNativeGoogleAuthProviderForPlatform,
} from "./native-auth-config";

export type SocialAuthProvider = "apple" | "google";

type SocialAuthResponse = Awaited<ReturnType<typeof authClient.signIn.social>>;

export type SocialAuthResult =
  | {
      response: SocialAuthResponse;
      status: "completed";
    }
  | {
      status: "cancelled";
    };

type PasswordAuthInput = {
  email: string;
  flow: "signIn" | "signUp";
  password: string;
};

export function useAuthSession() {
  return authClient.useSession();
}

export function hasNativeGoogleAuthConfig() {
  return hasNativeGoogleAuthConfigForPlatform(
    isIos() ? "ios" : isAndroid() ? "android" : "other",
    env,
  );
}

export function hasNativeAppleAuthProvider() {
  return hasNativeAppleAuthProviderForPlatform(
    isIos() ? "ios" : isAndroid() ? "android" : "other",
  );
}

export function hasNativeGoogleAuthProvider() {
  return hasNativeGoogleAuthProviderForPlatform(
    isIos() ? "ios" : isAndroid() ? "android" : "other",
  );
}

export async function isNativeAppleAuthAvailable() {
  return isIos() && (await AppleAuthentication.isAvailableAsync());
}

export async function signInWithPassword(input: PasswordAuthInput) {
  return input.flow === "signIn"
    ? await authClient.signIn.email({
        email: input.email,
        password: input.password,
      })
    : await authClient.signUp.email({
        email: input.email,
        name: input.email,
        password: input.password,
      });
}

function configureGoogleSignIn() {
  GoogleSignin.configure({
    iosClientId: env.googleIosClientId,
    scopes: ["email", "profile"],
    webClientId: env.googleWebClientId,
  });
}

function isGoogleSignInCancelled(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === statusCodes.SIGN_IN_CANCELLED
  );
}

function isAppleSignInCancelled(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ERR_REQUEST_CANCELED"
  );
}

async function signInWithGoogle(): Promise<SocialAuthResult> {
  if (!hasNativeGoogleAuthConfig()) {
    return {
      response: {
        data: null,
        error: {
          code: "GOOGLE_NATIVE_CONFIG_MISSING",
          message: "Connexion Google pas encore configurée sur cet appareil.",
          status: 400,
          statusText: "Bad Request",
        },
      },
      status: "completed",
    };
  }

  configureGoogleSignIn();

  if (isAndroid()) {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
  }

  try {
    const googleResponse = await GoogleSignin.signIn();

    if (googleResponse.type === "cancelled") {
      return { status: "cancelled" };
    }

    const { idToken } = googleResponse.data;

    if (!idToken) {
      return {
        response: {
          data: null,
          error: {
            code: "GOOGLE_ID_TOKEN_MISSING",
            message: "Connexion Google impossible pour le moment.",
            status: 400,
            statusText: "Bad Request",
          },
        },
        status: "completed",
      };
    }

    const tokens = await GoogleSignin.getTokens();

    return {
      response: await authClient.signIn.social({
        idToken: {
          accessToken: tokens.accessToken,
          token: idToken,
        },
        provider: "google",
      }),
      status: "completed",
    };
  } catch (error) {
    if (isGoogleSignInCancelled(error)) {
      return { status: "cancelled" };
    }

    throw error;
  }
}

async function signInWithApple(): Promise<SocialAuthResult> {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      return {
        response: {
          data: null,
          error: {
            code: "APPLE_ID_TOKEN_MISSING",
            message: "Connexion Apple impossible pour le moment.",
            status: 400,
            statusText: "Bad Request",
          },
        },
        status: "completed",
      };
    }

    return {
      response: await authClient.signIn.social({
        idToken: {
          token: credential.identityToken,
          user: {
            email: credential.email ?? undefined,
            name: {
              firstName: credential.fullName?.givenName ?? undefined,
              lastName: credential.fullName?.familyName ?? undefined,
            },
          },
        },
        provider: "apple",
      }),
      status: "completed",
    };
  } catch (error) {
    if (isAppleSignInCancelled(error)) {
      return { status: "cancelled" };
    }

    throw error;
  }
}

export async function signInWithSocial(
  provider: SocialAuthProvider,
): Promise<SocialAuthResult> {
  return provider === "google"
    ? await signInWithGoogle()
    : await signInWithApple();
}

export async function signOut() {
  await emailOtpAuthCapability.signOut();
}
