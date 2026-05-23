import {
  AUTH_ERROR_KEYS,
  AUTH_PASSWORD_MIN_LENGTH,
} from "@mybeachapp/shared/auth/constants";
import { authCredentialsSchema } from "@mybeachapp/shared/auth/schemas";
import type { AuthFlow } from "@mybeachapp/shared/auth/types";
import { router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type { authClient } from "./auth-client";
import {
  hasNativeAppleAuthProvider,
  hasNativeGoogleAuthProvider,
  type SocialAuthProvider,
  signInWithPassword,
  signInWithSocial,
} from "./session";

export type SignInFormValues = {
  email: string;
  password: string;
};

function getAuthFormErrorMessage(errorKey: string | undefined) {
  switch (errorKey) {
    case AUTH_ERROR_KEYS.emailInvalid:
      return "Vérifie ton email.";
    case AUTH_ERROR_KEYS.passwordTooShort:
      return `Ton mot de passe doit contenir au moins ${AUTH_PASSWORD_MIN_LENGTH} caractères.`;
    default:
      return "Vérifie ton email et ton mot de passe.";
  }
}

type AuthClientError = {
  code?: string;
  message?: string;
  status?: number;
};

type BetterAuthErrorCode = keyof typeof authClient.$ERROR_CODES;

const passwordAuthErrorMessages = {
  INVALID_EMAIL_OR_PASSWORD: "Email ou mot de passe incorrect.",
  MISSING_OR_NULL_ORIGIN: "Connexion impossible pour le moment.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
    "Un compte existe déjà avec cet email. Connecte-toi plutôt.",
} satisfies Partial<Record<BetterAuthErrorCode, string>>;

type PasswordAuthErrorCode = keyof typeof passwordAuthErrorMessages;

function isPasswordAuthErrorCode(
  code: string | undefined,
): code is PasswordAuthErrorCode {
  return Boolean(code && code in passwordAuthErrorMessages);
}

function getPasswordAuthErrorMessage(
  error: AuthClientError | null | undefined,
) {
  if (isPasswordAuthErrorCode(error?.code)) {
    return passwordAuthErrorMessages[error.code];
  }

  return error?.message ?? "Connexion impossible pour le moment.";
}

type UseSignInFlowOptions = {
  initialFlow?: AuthFlow;
};

export function useSignInFlow({
  initialFlow = "signIn",
}: UseSignInFlowOptions = {}) {
  const {
    clearErrors,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [flow, setFlow] = useState<AuthFlow>(initialFlow);
  const [socialProviderPending, setSocialProviderPending] =
    useState<SocialAuthProvider | null>(null);

  const isAuthenticating = isSubmitting || socialProviderPending !== null;
  const hasAppleAuth = hasNativeAppleAuthProvider();
  const hasGoogleAuth = hasNativeGoogleAuthProvider();
  const hasSocialAuth = hasAppleAuth || hasGoogleAuth;
  const formError =
    errors.root?.message ?? errors.email?.message ?? errors.password?.message;

  const submitPasswordAuth = handleSubmit(async (values) => {
    clearErrors("root");

    const result = authCredentialsSchema.safeParse({
      ...values,
      flow,
    });

    if (!result.success) {
      setError("root", {
        message: getAuthFormErrorMessage(result.error.issues[0]?.message),
      });
      return;
    }

    try {
      const response = await signInWithPassword(result.data);

      if (response.error) {
        setError("root", {
          message: getPasswordAuthErrorMessage(response.error),
        });
        return;
      }

      router.replace("/");
    } catch {
      setError("root", {
        message: "Connexion impossible pour le moment.",
      });
    }
  });

  async function submitSocialAuth(provider: SocialAuthProvider) {
    clearErrors("root");
    setSocialProviderPending(provider);

    try {
      const response = await signInWithSocial(provider);

      if (response.status === "cancelled") {
        return;
      }

      if (response.response.error) {
        setError("root", {
          message:
            response.response.error.message ??
            "Connexion impossible pour le moment.",
        });
        return;
      }

      router.replace("/");
    } catch {
      setError("root", {
        message: "Connexion impossible pour le moment.",
      });
    } finally {
      setSocialProviderPending(null);
    }
  }

  function toggleFlow() {
    clearErrors("root");
    setFlow((currentFlow) => (currentFlow === "signIn" ? "signUp" : "signIn"));
  }

  return {
    control,
    flow,
    formError,
    hasAppleAuth,
    hasGoogleAuth,
    hasSocialAuth,
    isAuthenticating,
    submitPasswordAuth,
    submitSocialAuth,
    toggleFlow,
  };
}
