import { KeyRound, Mail, Waves } from "@tamagui/lucide-icons-2";
import type React from "react";
import { KeyboardAvoidingView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Circle, ScrollView, YStack } from "tamagui";

import {
  EmailField,
  OtpCodeField,
  SocialAuthActions,
} from "@/src/auth/email-otp-auth-fields";
import type { AuthPendingAction } from "@/src/auth/sign-in-flow";
import { Button } from "@/ui/button";
import { FloatingSurface } from "@/ui/surface";
import { Headline, Text, Title } from "@/ui/typography";

type EmailOtpAuthPanelProps = {
  authPendingAction: AuthPendingAction;
  emailError?: string;
  emailValue: string;
  formError?: string | null;
  hasAppleAuth: boolean;
  hasGoogleAuth: boolean;
  hasSocialAuth: boolean;
  isEmailStepStarted: boolean;
  isAuthUiDisabled: boolean;
  isOtpStep: boolean;
  onAppleAuth: () => void;
  onEmailBlur: () => void;
  onEmailChange: (value: string) => void;
  onGoogleAuth: () => void;
  onOtpBlur: () => void;
  onOtpChange: (value: string) => void;
  onStartEmail: () => void;
  onSubmitEmail: () => void;
  onSubmitOtp: () => void;
  onSubmitOtpCode: (code: string) => void;
  otpEmail: string;
  otpError?: string;
  otpValue: string;
  resendCountdown: number;
};

export function EmailOtpAuthPanel({
  authPendingAction,
  emailError,
  emailValue,
  formError,
  hasAppleAuth,
  hasGoogleAuth,
  hasSocialAuth,
  isEmailStepStarted,
  isAuthUiDisabled,
  isOtpStep,
  onAppleAuth,
  onEmailBlur,
  onEmailChange,
  onGoogleAuth,
  onOtpBlur: _onOtpBlur,
  onOtpChange,
  onStartEmail,
  onSubmitEmail,
  onSubmitOtp,
  onSubmitOtpCode,
  otpEmail,
  otpError,
  otpValue,
  resendCountdown,
}: EmailOtpAuthPanelProps) {
  const insets = useSafeAreaInsets();

  if (isOtpStep) {
    return (
      <AuthStepLayout
        bottom={
          <Button
            disabled={isAuthUiDisabled || otpValue.length !== 6}
            haptic="medium"
            loading={authPendingAction === "otp"}
            loadingLabel="Connexion"
            onPress={onSubmitOtp}
            opacity={otpValue.length === 6 ? 1 : 0.5}
          >
            Suivant
          </Button>
        }
        description="On a envoyé un code de vérification à ton email"
        descriptionSecondLine={otpEmail}
        icon={KeyRound}
        title="Entre le code"
      >
        <OtpCodeField
          disabled={isAuthUiDisabled}
          error={otpError}
          onChangeText={onOtpChange}
          onCodeFilled={onSubmitOtpCode}
          onResend={onSubmitEmail}
          resendCountdown={resendCountdown}
          resendLoading={authPendingAction === "email"}
          value={otpValue}
        />
        <AuthErrorMessage message={formError} />
      </AuthStepLayout>
    );
  }

  if (isEmailStepStarted) {
    return (
      <AuthStepLayout
        bottom={
          <Button
            disabled={isAuthUiDisabled || !emailValue.trim()}
            haptic="medium"
            loading={authPendingAction === "email"}
            loadingLabel="Envoi"
            onPress={onSubmitEmail}
            opacity={emailValue.trim() ? 1 : 0.5}
          >
            Suivant
          </Button>
        }
        description="Connecte-toi ou inscris-toi avec ton email."
        icon={Mail}
        title="Continuer avec email"
      >
        <EmailField
          disabled={isAuthUiDisabled}
          error={emailError}
          onBlur={onEmailBlur}
          onChangeText={onEmailChange}
          onSubmit={onSubmitEmail}
          value={emailValue}
        />
        <AuthErrorMessage message={formError} />
      </AuthStepLayout>
    );
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <YStack bg="$background" flex={1}>
        <YStack
          gap="$md"
          height={340}
          items="center"
          justify="flex-end"
          pb="$xs"
          pt={insets.top + 92}
          px="$xl"
        >
          <AuthLogoMark size={64} />
          <YStack gap="$xs" items="center">
            <Headline selectable size="lg" text="center">
              My Beach App
            </Headline>
            <Text selectable text="center" variant="muted">
              Connecte-toi pour continuer.
            </Text>
          </YStack>
        </YStack>

        <FloatingSurface
          borderBottomLeftRadius={0}
          borderBottomRightRadius={0}
          borderBottomWidth={0}
          flex={1}
          gap="$md"
          pb={insets.bottom + 16}
          pt="$lg"
          px="$lg"
          rounded="$xxl"
        >
          <Button
            disabled={isAuthUiDisabled}
            haptic="medium"
            icon={Mail}
            onPress={onStartEmail}
          >
            Continuer avec email
          </Button>
          {hasSocialAuth ? (
            <SocialAuthActions
              disabled={isAuthUiDisabled}
              hasAppleAuth={hasAppleAuth}
              hasGoogleAuth={hasGoogleAuth}
              onAppleAuth={onAppleAuth}
              onGoogleAuth={onGoogleAuth}
              pendingProvider={
                authPendingAction === "apple" || authPendingAction === "google"
                  ? authPendingAction
                  : null
              }
            />
          ) : null}
          <Text selectable size="sm" text="center" variant="muted">
            En continuant, tu acceptes les conditions d’utilisation, la
            politique de confidentialité et les règles de la communauté.
          </Text>
          <AuthErrorMessage message={formError} />
        </FloatingSurface>
      </YStack>
    </KeyboardAvoidingView>
  );
}

type AuthStepLayoutProps = {
  bottom: React.ReactNode;
  children: React.ReactNode;
  description: string;
  descriptionSecondLine?: string;
  icon: typeof Mail;
  title: string;
};

function AuthStepLayout({
  bottom,
  children,
  description,
  descriptionSecondLine,
  icon: Icon,
  title,
}: AuthStepLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView
        bg="$background"
        contentInsetAdjustmentBehavior="automatic"
        flex={1}
        keyboardShouldPersistTaps="handled"
      >
        <YStack flex={1} gap="$xl" pb={insets.bottom + 16} pt={insets.top + 24}>
          <YStack gap="$md" items="center" px="$lg">
            <Circle
              bg="$surface"
              borderColor="$border"
              borderWidth={1}
              shadowColor="$foreground"
              shadowOffset={{ height: 8, width: 0 }}
              shadowOpacity={0.08}
              shadowRadius={18}
              size={52}
            >
              <Icon color="$foreground" size={26} strokeWidth={2.1} />
            </Circle>

            <YStack gap="$xs" items="center">
              <Title selectable text="center">
                {title}
              </Title>
              <Text selectable text="center" variant="muted">
                {description}
              </Text>
              {descriptionSecondLine ? (
                <Text selectable text="center">
                  {descriptionSecondLine}
                </Text>
              ) : null}
            </YStack>
          </YStack>

          <YStack gap="$md" px="$lg">
            {children}
          </YStack>

          <YStack mt="auto" px="$lg">
            {bottom}
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function AuthLogoMark({ size }: { size: number }) {
  return (
    <Circle
      bg="$surface"
      borderColor="$border"
      borderWidth={1}
      shadowColor="$foreground"
      shadowOffset={{ height: 10, width: 0 }}
      shadowOpacity={0.1}
      shadowRadius={24}
      size={size}
    >
      <Waves
        color="$foreground"
        size={size === 64 ? 30 : 34}
        strokeWidth={2.1}
      />
    </Circle>
  );
}

function AuthErrorMessage({ message }: { message?: null | string }) {
  if (!message) {
    return null;
  }

  return (
    <Text selectable text="center" variant="destructive">
      {message}
    </Text>
  );
}
