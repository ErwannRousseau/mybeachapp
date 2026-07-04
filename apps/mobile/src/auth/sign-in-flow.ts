import { AUTH_EMAIL_OTP_RESEND_AFTER_SECONDS } from "@mybeachapp/shared/auth/constants";
import type { AuthFlow } from "@mybeachapp/shared/auth/types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { emailOtpAuthCapability } from "./email-otp-capability";
import {
  hasNativeAppleAuthProvider,
  hasNativeGoogleAuthProvider,
  type SocialAuthProvider,
  signInWithSocial,
} from "./session";

export type SignInFormValues = {
  email: string;
  otp: string;
};

export type AuthPendingAction = "apple" | "email" | "google" | "otp" | null;

function isEmailError(code: string) {
  return code === "email_invalid" || code === "INVALID_EMAIL";
}

function isOtpError(code: string) {
  return (
    code === "otp_invalid" || code === "INVALID_OTP" || code === "OTP_EXPIRED"
  );
}

type UseSignInFlowOptions = {
  initialFlow?: AuthFlow;
  onOtpStepStarted?: () => void;
};

export function useSignInFlow({
  initialFlow = "signIn",
  onOtpStepStarted,
}: UseSignInFlowOptions = {}) {
  const {
    clearErrors,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
    setValue,
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      otp: "",
    },
  });
  const [flow] = useState<AuthFlow>(initialFlow);
  const [otpEmail, setOtpEmail] = useState<null | string>(null);
  const [pendingAction, setPendingAction] = useState<AuthPendingAction>(null);
  const [resendCountdown, setResendCountdown] = useState(0);

  const isAuthenticating = isSubmitting || pendingAction !== null;
  const hasAppleAuth = hasNativeAppleAuthProvider();
  const hasGoogleAuth = hasNativeGoogleAuthProvider();
  const hasSocialAuth = hasAppleAuth || hasGoogleAuth;
  const fieldErrors = {
    email: errors.email?.message,
    otp: errors.otp?.message,
  };
  const formError = errors.root?.message;
  const isOtpStep = otpEmail !== null;

  useEffect(() => {
    if (resendCountdown === 0) {
      return;
    }

    const timer = setTimeout(() => {
      setResendCountdown((currentCountdown) =>
        Math.max(0, currentCountdown - 1),
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const submitEmailOtp = handleSubmit(async (values) => {
    clearErrors();
    setPendingAction("email");

    try {
      const response = await emailOtpAuthCapability.sendEmailOtp({
        email: values.email,
      });

      if (response.error) {
        setError(isEmailError(response.error.code) ? "email" : "root", {
          message: response.error.message,
        });
        return;
      }

      onOtpStepStarted?.();
      setOtpEmail(response.data.email);
      setResendCountdown(AUTH_EMAIL_OTP_RESEND_AFTER_SECONDS);
      setValue("email", response.data.email);
      setValue("otp", "");
    } finally {
      setPendingAction((currentAction) =>
        currentAction === "email" ? null : currentAction,
      );
    }
  });

  function submitOtpAuth(otpOverride?: string) {
    return handleSubmit(async (values) => {
      clearErrors();
      setPendingAction("otp");

      try {
        const response = await emailOtpAuthCapability.signInWithEmailOtp({
          email: otpEmail ?? values.email,
          otp: otpOverride ?? values.otp,
        });

        if (response.error) {
          setError(isOtpError(response.error.code) ? "otp" : "root", {
            message: response.error.message,
          });
          setValue("otp", "");
          return;
        }

        router.replace("/(tabs)");
      } finally {
        setPendingAction((currentAction) =>
          currentAction === "otp" ? null : currentAction,
        );
      }
    })();
  }

  async function submitSocialAuth(provider: SocialAuthProvider) {
    clearErrors();
    setPendingAction(provider);

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

      router.replace("/(tabs)");
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }

      setError("root", {
        message: "Connexion impossible pour le moment.",
      });
    } finally {
      setPendingAction((currentAction) =>
        currentAction === provider ? null : currentAction,
      );
    }
  }

  function changeEmail() {
    clearErrors();
    setOtpEmail(null);
    setResendCountdown(0);
    setValue("otp", "");
  }

  return {
    authPendingAction: pendingAction,
    changeEmail,
    control,
    fieldErrors,
    flow,
    formError,
    hasAppleAuth,
    hasGoogleAuth,
    hasSocialAuth,
    isAuthenticating,
    isOtpStep,
    otpEmail,
    resendCountdown,
    submitEmailOtp,
    submitOtpAuth,
    submitSocialAuth,
  };
}

export type UseSignInFlowResult = ReturnType<typeof useSignInFlow>;
