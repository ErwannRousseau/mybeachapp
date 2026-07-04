import type { AuthFlow } from "@mybeachapp/shared/auth/types";
import { router, Stack } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useController } from "react-hook-form";

import { EmailOtpAuthPanel } from "@/src/auth/email-otp-auth-panel";
import { emailOtpAuthCapability } from "@/src/auth/email-otp-capability";
import { useSignInFlow } from "@/src/auth/sign-in-flow";

type AuthScreenProps = {
  flow: AuthFlow;
};

export function AuthScreen({ flow }: AuthScreenProps) {
  const [isEmailStepStarted, setIsEmailStepStarted] = useState(false);
  const isEmailStepStartedRef = useRef(false);
  const isOtpStepRef = useRef(false);
  const markOtpStepStarted = useCallback(() => {
    isEmailStepStartedRef.current = true;
    isOtpStepRef.current = true;
  }, []);
  const {
    authPendingAction,
    control,
    fieldErrors,
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
  } = useSignInFlow({
    initialFlow: flow,
    onOtpStepStarted: markOtpStepStarted,
  });
  const {
    field: { onBlur: onEmailBlur, onChange: onEmailChange, value: emailValue },
  } = useController({ control, name: "email" });
  const {
    field: { onBlur: onOtpBlur, onChange: onOtpChange, value: otpValue },
  } = useController({ control, name: "otp" });
  const isAuthUiDisabled = isAuthenticating;

  const startEmailStep = useCallback(() => {
    isEmailStepStartedRef.current = true;
    isOtpStepRef.current = false;
    setIsEmailStepStarted(true);
  }, []);

  const submitAppleAuth = useCallback(() => {
    void submitSocialAuth("apple");
  }, [submitSocialAuth]);

  const submitGoogleAuth = useCallback(() => {
    void submitSocialAuth("google");
  }, [submitSocialAuth]);

  const submitEmail = useCallback(() => {
    void submitEmailOtp();
  }, [submitEmailOtp]);

  const submitOtp = useCallback(() => {
    void submitOtpAuth();
  }, [submitOtpAuth]);

  const submitOtpCode = useCallback(
    (code: string) => {
      void submitOtpAuth(code);
    },
    [submitOtpAuth],
  );

  useEffect(() => {
    isOtpStepRef.current = isOtpStep;
  }, [isOtpStep]);

  useEffect(() => {
    let isMounted = true;

    async function redirectSignedInUser() {
      const response = await emailOtpAuthCapability.getCurrentUser();

      if (!isMounted) {
        return;
      }

      if (response.data) {
        router.replace("/(tabs)");
      }
    }

    void redirectSignedInUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerBackButtonDisplayMode: "minimal",
          headerShadowVisible: false,
          headerShown: true,
          headerTransparent: true,
        }}
      />
      <EmailOtpAuthPanel
        authPendingAction={authPendingAction}
        emailError={fieldErrors.email}
        emailValue={emailValue}
        formError={formError}
        hasAppleAuth={hasAppleAuth}
        hasGoogleAuth={hasGoogleAuth}
        hasSocialAuth={hasSocialAuth}
        isAuthUiDisabled={isAuthUiDisabled}
        isEmailStepStarted={isEmailStepStarted}
        isOtpStep={isOtpStep}
        onAppleAuth={submitAppleAuth}
        onEmailBlur={onEmailBlur}
        onEmailChange={onEmailChange}
        onGoogleAuth={submitGoogleAuth}
        onOtpBlur={onOtpBlur}
        onOtpChange={onOtpChange}
        onStartEmail={startEmailStep}
        onSubmitEmail={submitEmail}
        onSubmitOtp={submitOtp}
        onSubmitOtpCode={submitOtpCode}
        otpEmail={otpEmail ?? emailValue}
        otpError={fieldErrors.otp}
        otpValue={otpValue}
        resendCountdown={resendCountdown}
      />
    </>
  );
}
