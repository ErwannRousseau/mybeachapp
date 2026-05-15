import { api } from "@mybeachapp/backend/convex/_generated/api";
import { router } from "expo-router";

import { authClient } from "./auth-client";

export const authCapabilitiesQuery = api.auth.getCapabilities;

export type SocialAuthProvider = "apple" | "google";

type PasswordAuthInput = {
  email: string;
  flow: "signIn" | "signUp";
  password: string;
};

export function useAuthSession() {
  return authClient.useSession();
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

export async function signInWithSocial(provider: SocialAuthProvider) {
  return await authClient.signIn.social({
    callbackURL: "/",
    provider,
  });
}

export async function signOutAndRedirect() {
  await authClient.signOut();
  router.replace("/sign-in");
}
