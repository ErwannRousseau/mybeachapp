import type { AuthFlow } from "@mybeachapp/shared/auth/types";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { Link, router, Stack } from "expo-router";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { KeyboardAvoidingView } from "react-native";
import { ScrollView, YStack } from "tamagui";

import { useAuthSession } from "@/src/auth/session";
import { useSignInFlow } from "@/src/auth/sign-in-flow";
import { Button } from "@/ui/button";
import { Field, FieldError } from "@/ui/field";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
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
                      onPress={() => void submitSocialAuth("apple")}
                      style={{ height: 54, width: "100%" }}
                    />
                  </YStack>
                ) : null}
                {hasGoogleAuth ? (
                  <GoogleSigninButton
                    color={GoogleSigninButton.Color.Light}
                    disabled={isAuthenticating}
                    onPress={() => void submitSocialAuth("google")}
                    size={GoogleSigninButton.Size.Wide}
                    style={{ height: 54, width: "100%" }}
                  />
                ) : null}
              </YStack>
            ) : null}

            {hasSocialAuth ? <YStack bg="$border" height={1} /> : null}

            <Field>
              <Label>Email</Label>
              <Controller
                control={control}
                name="email"
                render={({ field: { onBlur, onChange, value } }) => (
                  <Input
                    autoCapitalize="none"
                    autoComplete="email"
                    inputState={fieldErrors.email ? "error" : "default"}
                    keyboardType="email-address"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="toi@example.com"
                    textContentType="emailAddress"
                    value={value}
                  />
                )}
              />
              {fieldErrors.email ? (
                <FieldError>{fieldErrors.email}</FieldError>
              ) : null}
            </Field>

            <Field>
              <Label>Mot de passe</Label>
              <Controller
                control={control}
                name="password"
                render={({ field: { onBlur, onChange, value } }) => (
                  <Input
                    autoComplete={
                      isSignIn ? "current-password" : "new-password"
                    }
                    inputState={fieldErrors.password ? "error" : "default"}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="12 caractères minimum"
                    secureTextEntry
                    textContentType={isSignIn ? "password" : "newPassword"}
                    value={value}
                  />
                )}
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

            <Button
              disabled={isAuthenticating}
              onPress={() => void submitPasswordAuth()}
            >
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
