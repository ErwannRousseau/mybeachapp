import { AUTH_EMAIL_OTP_LENGTH } from "@mybeachapp/shared/auth/constants";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { XStack, YStack } from "tamagui";

import { AppleBrandIcon, GoogleBrandIcon } from "@/src/auth/auth-brand-icons";
import { OtpInput } from "@/src/auth/otp-input";
import { Button } from "@/ui/button";
import { FieldLabel } from "@/ui/field";
import { Input } from "@/ui/input";
import { Separator } from "@/ui/separator";
import { Text } from "@/ui/typography";

type EmailFieldProps = {
  disabled: boolean;
  error?: string;
  onBlur: () => void;
  onChangeText: (value: string) => void;
  onSubmit: () => void;
  value: string;
};

export function EmailField({
  disabled,
  error,
  onBlur,
  onChangeText,
  onSubmit,
  value,
}: EmailFieldProps) {
  const { t } = useTranslation();

  return (
    <YStack gap="$xs">
      <FieldLabel>{t("auth.email.label")}</FieldLabel>
      <Input
        accessibilityLabel={t("auth.email.label")}
        autoCapitalize="none"
        autoComplete="email"
        disabled={disabled}
        invalid={Boolean(error)}
        keyboardType="email-address"
        onBlur={onBlur}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={t("auth.email.placeholder")}
        textContentType="emailAddress"
        value={value}
      />
      {error ? (
        <Text selectable size="sm" variant="destructive">
          {error}
        </Text>
      ) : null}
    </YStack>
  );
}

type OtpCodeFieldProps = {
  disabled: boolean;
  error?: string;
  onChangeText: (value: string) => void;
  onCodeFilled: (code: string) => void;
  onResend: () => void;
  resendLoading: boolean;
  resendCountdown: number;
  value: string;
};

export function OtpCodeField({
  disabled,
  error,
  onChangeText,
  onCodeFilled,
  onResend,
  resendLoading,
  resendCountdown,
  value,
}: OtpCodeFieldProps) {
  const { t } = useTranslation();
  const lastSubmittedCode = useRef("");

  useEffect(() => {
    if (value.length < AUTH_EMAIL_OTP_LENGTH) {
      lastSubmittedCode.current = "";
      return;
    }

    if (disabled || value === lastSubmittedCode.current) {
      return;
    }

    lastSubmittedCode.current = value;
    onCodeFilled(value);
  }, [disabled, onCodeFilled, value]);

  return (
    <YStack gap="$xs" items="center">
      <OtpInput
        autoFocus
        disabled={disabled}
        invalid={Boolean(error)}
        onCodeChange={onChangeText}
        value={value}
      />
      {error ? (
        <Text selectable size="sm" text="center" variant="destructive">
          {error}
        </Text>
      ) : null}
      {resendCountdown > 0 ? (
        <Text selectable text="center" variant="muted">
          {t("auth.otp.resendCountdown", { count: resendCountdown })}
        </Text>
      ) : (
        <Button
          disabled={disabled}
          fullWidth={false}
          loading={resendLoading}
          loadingLabel={t("auth.otp.resendLoading")}
          onPress={onResend}
          size="sm"
          variant="text"
        >
          {t("auth.otp.resend")}
        </Button>
      )}
    </YStack>
  );
}

type SocialAuthActionsProps = {
  disabled: boolean;
  hasAppleAuth: boolean;
  hasGoogleAuth: boolean;
  onAppleAuth: () => void;
  onGoogleAuth: () => void;
  pendingProvider: "apple" | "google" | null;
};

export function SocialAuthActions({
  disabled,
  hasAppleAuth,
  hasGoogleAuth,
  onAppleAuth,
  onGoogleAuth,
  pendingProvider,
}: SocialAuthActionsProps) {
  const { t } = useTranslation();

  if (!hasAppleAuth && !hasGoogleAuth) {
    return null;
  }

  return (
    <YStack gap="$sm">
      <XStack gap="$sm" items="center">
        <Separator />
        <Text size="sm" variant="muted">
          {t("auth.social.separator")}
        </Text>
        <Separator />
      </XStack>

      <XStack gap="$sm">
        {hasGoogleAuth ? (
          <Button
            disabled={disabled}
            flex={1}
            fullWidth={false}
            haptic="light"
            icon={GoogleBrandIcon}
            loading={pendingProvider === "google"}
            loadingLabel="Google"
            onPress={onGoogleAuth}
            variant="surface"
          >
            Google
          </Button>
        ) : null}
        {hasAppleAuth ? (
          <Button
            disabled={disabled}
            flex={1}
            fullWidth={false}
            haptic="light"
            icon={AppleBrandIcon}
            loading={pendingProvider === "apple"}
            loadingLabel="Apple"
            onPress={onAppleAuth}
            variant="surface"
          >
            Apple
          </Button>
        ) : null}
      </XStack>
    </YStack>
  );
}
