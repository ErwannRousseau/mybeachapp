import type { AuthFlow } from "@mybeachapp/shared/auth/types";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { Link, router, Stack } from "expo-router";
import { useCallback, useEffect } from "react";
import { useController } from "react-hook-form";
import { KeyboardAvoidingView } from "react-native";
import { ScrollView, YStack } from "tamagui";

import { useAuthSession } from "@/src/auth/session";
import { useSignInFlow } from "@/src/auth/sign-in-flow";
import { Button } from "@/ui/button";
import { Field, FieldError, FieldLabel } from "@/ui/field";
import { Input } from "@/ui/input";
import { Headline, Text } from "@/ui/typography";

type AuthScreenProps = {
  flow: AuthFlow;
};

export function AuthScreen({ flow }: AuthScreenProps) {
  const { data: session, isPending: isSessionPending } = useAuthSession();
  const {
    control,
    fieldErrors,
    formError,
    hasAppleAuth,
    hasGoogleAuth,
    hasSocialAuth,
    isAuthenticating,
    submitPasswordAuth,
    submitSocialAuth,
  } = useSignInFlow({ initialFlow: flow });
  const isSignIn = flow === "signIn";
  const {
    field: { onBlur: onEmailBlur, onChange: onEmailChange, value: emailValue },
  } = useController({ control, name: "email" });
  const {
    field: {
      onBlur: onPasswordBlur,
      onChange: onPasswordChange,
      value: passwordValue,
    },
  } = useController({ control, name: "password" });

  const submitAppleAuth = useCallback(() => {
    void submitSocialAuth("apple");
  }, [submitSocialAuth]);

  const submitGoogleAuth = useCallback(() => {
    void submitSocialAuth("google");
  }, [submitSocialAuth]);

  const submitPassword = useCallback(() => {
    void submitPasswordAuth();
  }, [submitPasswordAuth]);

  useEffect(() => {
    if (!(session || isSessionPending)) {
      return;
    }

    if (session) {
      router.replace("/(tabs)");
    }
  }, [isSessionPending, session]);

  return (
    <>
      <Stack.Screen
        options={{ title: isSignIn ? "Connexion" : "Inscription" }}
      />
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView
          bg="$background"
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
        >
          <YStack gap="$lg" p="$md">
            <YStack gap="$sm">
              <Headline selectable>
                {isSignIn ? "Se connecter" : "Créer un compte"}
              </Headline>
              <Text selectable variant="muted">
                {isSignIn
                  ? "Connecte-toi avec email, Apple ou Google pour créer et rejoindre des activités."
                  : "Inscris-toi avec email, Apple ou Google pour préparer ton profil My Beach App."}
              </Text>
            </YStack>

            {hasSocialAuth ? (
              <YStack gap="$sm">
                {hasAppleAuth ? (
                  <YStack
                    opacity={isAuthenticating ? 0.5 : 1}
                    pointerEvents={isAuthenticating ? "none" : "auto"}
                  >
                    <AppleAuthentication.AppleAuthenticationButton
                      buttonStyle={
                        AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                      }
                      buttonType={
                        isSignIn
                          ? AppleAuthentication.AppleAuthenticationButtonType
                              .SIGN_IN
                          : AppleAuthentication.AppleAuthenticationButtonType
                              .SIGN_UP
                      }
                      cornerRadius={27}
                      onPress={submitAppleAuth}
                      style={{ height: 54, width: "100%" }}
                    />
                  </YStack>
                ) : null}
                {hasGoogleAuth ? (
                  <GoogleSigninButton
                    color={GoogleSigninButton.Color.Light}
                    disabled={isAuthenticating}
                    onPress={submitGoogleAuth}
                    size={GoogleSigninButton.Size.Wide}
                    style={{ height: 54, width: "100%" }}
                  />
                ) : null}
              </YStack>
            ) : null}

            {hasSocialAuth ? <YStack bg="$border" height={1} /> : null}

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                autoCapitalize="none"
                autoComplete="email"
                invalid={Boolean(fieldErrors.email)}
                keyboardType="email-address"
                onBlur={onEmailBlur}
                onChangeText={onEmailChange}
                placeholder="toi@example.com"
                textContentType="emailAddress"
                value={emailValue}
              />
              {fieldErrors.email ? (
                <FieldError>{fieldErrors.email}</FieldError>
              ) : null}
            </Field>

            <Field>
              <FieldLabel>Mot de passe</FieldLabel>
              <Input
                autoComplete={isSignIn ? "current-password" : "new-password"}
                invalid={Boolean(fieldErrors.password)}
                onBlur={onPasswordBlur}
                onChangeText={onPasswordChange}
                placeholder="12 caractères minimum"
                secureTextEntry
                textContentType={isSignIn ? "password" : "newPassword"}
                value={passwordValue}
              />
              {fieldErrors.password ? (
                <FieldError>{fieldErrors.password}</FieldError>
              ) : null}
            </Field>

            {formError ? (
              <Text selectable variant="destructive">
                {formError}
              </Text>
            ) : null}

            <Button disabled={isAuthenticating} onPress={submitPassword}>
              {isSignIn ? "Se connecter" : "Créer un compte"}
            </Button>
            <Link asChild href={isSignIn ? "/sign-up" : "/sign-in"}>
              <Button disabled={isAuthenticating} variant="secondary">
                {isSignIn
                  ? "Créer un compte avec email"
                  : "J’ai déjà un compte"}
              </Button>
            </Link>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
