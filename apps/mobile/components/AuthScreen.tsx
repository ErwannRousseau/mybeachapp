import type { AuthFlow } from "@mybeachapp/shared/auth/types";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { Link, router, Stack } from "expo-router";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { useAuthSession } from "@/src/auth/session";
import { useSignInFlow } from "@/src/auth/sign-in-flow";

import { PrimaryButton } from "./PrimaryButton";

type AuthScreenProps = {
  flow: AuthFlow;
};

export function AuthScreen({ flow }: AuthScreenProps) {
  const { data: session, isPending: isSessionPending } = useAuthSession();
  const {
    control,
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
    if (!isSessionPending && session) {
      router.replace("/");
    }
  }, [isSessionPending, session]);

  return (
    <>
      <Stack.Screen
        options={{ title: isSignIn ? "Connexion" : "Inscription" }}
      />
      <KeyboardAvoidingView behavior="padding" style={styles.keyboard}>
        <ScrollView
          contentContainerStyle={styles.content}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            <Text selectable style={styles.title}>
              {isSignIn ? "Se connecter" : "Créer un compte"}
            </Text>
            <Text selectable style={styles.body}>
              {isSignIn
                ? "Connecte-toi avec email, Apple ou Google pour créer et rejoindre des activités."
                : "Inscris-toi avec email, Apple ou Google pour préparer ton profil My Beach App."}
            </Text>
          </View>

          {hasSocialAuth ? (
            <View style={styles.oauthGroup}>
              {hasAppleAuth ? (
                <View
                  pointerEvents={isAuthenticating ? "none" : "auto"}
                  style={isAuthenticating ? styles.disabled : undefined}
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
                    style={styles.nativeAuthButton}
                  />
                </View>
              ) : null}
              {hasGoogleAuth ? (
                <GoogleSigninButton
                  color={GoogleSigninButton.Color.Light}
                  disabled={isAuthenticating}
                  onPress={() => void submitSocialAuth("google")}
                  size={GoogleSigninButton.Size.Wide}
                  style={styles.googleAuthButton}
                />
              ) : null}
            </View>
          ) : null}

          {hasSocialAuth ? <View style={styles.divider} /> : null}

          <View style={styles.fieldGroup}>
            <Text selectable style={styles.label}>
              Email
            </Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="toi@example.com"
                  placeholderTextColor="#6B7C86"
                  style={styles.input}
                  textContentType="emailAddress"
                  value={value}
                />
              )}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text selectable style={styles.label}>
              Mot de passe
            </Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                  autoComplete={isSignIn ? "current-password" : "new-password"}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="12 caractères minimum"
                  placeholderTextColor="#6B7C86"
                  secureTextEntry
                  style={styles.input}
                  textContentType={isSignIn ? "password" : "newPassword"}
                  value={value}
                />
              )}
            />
          </View>

          {formError ? (
            <Text selectable style={styles.errorText}>
              {formError}
            </Text>
          ) : null}

          <PrimaryButton
            disabled={isAuthenticating}
            label={isSignIn ? "Se connecter" : "Créer un compte"}
            onPress={() => void submitPasswordAuth()}
          />
          <Link asChild href={isSignIn ? "/sign-up" : "/sign-in"}>
            <PrimaryButton
              disabled={isAuthenticating}
              label={
                isSignIn ? "Créer un compte avec email" : "J’ai déjà un compte"
              }
              variant="secondary"
            />
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  body: {
    ...theme.typography.body,
    color: theme.colors.onSurfaceMuted,
  },
  content: {
    backgroundColor: theme.colors.background,
    gap: theme.spacing.lg,
    padding: theme.spacing.md,
  },
  disabled: {
    opacity: 0.5,
  },
  divider: {
    backgroundColor: theme.colors.border,
    height: 1,
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error,
  },
  fieldGroup: {
    gap: theme.spacing.xs,
  },
  googleAuthButton: {
    alignSelf: "stretch",
    height: 54,
    width: "100%",
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    color: theme.colors.onSurface,
    minHeight: 52,
    paddingHorizontal: theme.spacing.md,
  },
  keyboard: {
    flex: 1,
  },
  label: {
    ...theme.typography.bodyStrong,
    color: theme.colors.onSurface,
  },
  nativeAuthButton: {
    height: 54,
    width: "100%",
  },
  oauthGroup: {
    gap: theme.spacing.sm,
  },
  section: {
    gap: theme.spacing.sm,
  },
  title: {
    ...theme.typography.headline,
    color: theme.colors.onSurface,
  },
}));
