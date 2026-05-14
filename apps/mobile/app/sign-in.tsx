import { useAuthActions } from "@convex-dev/auth/react";
import { authCredentialsSchema } from "@mybeachapp/shared/auth/schemas";
import type { AuthFlow } from "@mybeachapp/shared/auth/types";
import * as Linking from "expo-linking";
import { Stack } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { PrimaryButton } from "@/components/PrimaryButton";

WebBrowser.maybeCompleteAuthSession();

const oauthCallbackUrl = Linking.createURL("/sign-in");

export default function SignInScreen() {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [flow, setFlow] = useState<AuthFlow>("signIn");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");

  async function handlePasswordAuth() {
    setErrorMessage(null);
    const result = authCredentialsSchema.safeParse({
      email,
      flow,
      password,
    });

    if (!result.success) {
      setErrorMessage("Vérifie ton email et ton mot de passe.");
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn("password", result.data);
    } catch {
      setErrorMessage("Connexion impossible pour le moment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleOAuth(provider: "apple" | "google") {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const { redirect } = await signIn(provider, {
        redirectTo: oauthCallbackUrl,
      });

      if (!redirect) {
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(
        redirect.toString(),
        oauthCallbackUrl,
      );

      if (result.type !== "success") {
        return;
      }

      const parsed = Linking.parse(result.url);
      const code = parsed.queryParams?.code;

      if (typeof code === "string") {
        await signIn(provider, { code });
      }
    } catch {
      setErrorMessage("Connexion OAuth impossible pour le moment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: "Connexion" }} />
      <KeyboardAvoidingView behavior="padding" style={styles.keyboard}>
        <ScrollView
          contentContainerStyle={styles.content}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            <Text selectable style={styles.title}>
              Se connecter
            </Text>
            <Text selectable style={styles.body}>
              Connecte-toi avec email, Apple ou Google pour créer et rejoindre
              des activités.
            </Text>
          </View>

          <View style={styles.oauthGroup}>
            <PrimaryButton
              disabled={isSubmitting}
              label="Continuer avec Apple"
              onPress={() => void handleOAuth("apple")}
              variant="secondary"
            />
            <PrimaryButton
              disabled={isSubmitting}
              label="Continuer avec Google"
              onPress={() => void handleOAuth("google")}
              variant="secondary"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.fieldGroup}>
            <Text selectable style={styles.label}>
              Email
            </Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="toi@example.com"
              placeholderTextColor="#6B7C86"
              style={styles.input}
              textContentType="emailAddress"
              value={email}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text selectable style={styles.label}>
              Mot de passe
            </Text>
            <TextInput
              autoComplete={
                flow === "signIn" ? "current-password" : "new-password"
              }
              onChangeText={setPassword}
              placeholder="8 caractères minimum"
              placeholderTextColor="#6B7C86"
              secureTextEntry
              style={styles.input}
              textContentType={flow === "signIn" ? "password" : "newPassword"}
              value={password}
            />
          </View>

          {errorMessage ? (
            <Text selectable style={styles.errorText}>
              {errorMessage}
            </Text>
          ) : null}

          <PrimaryButton
            disabled={isSubmitting}
            label={flow === "signIn" ? "Se connecter" : "Créer un compte"}
            onPress={() => void handlePasswordAuth()}
          />
          <PrimaryButton
            disabled={isSubmitting}
            label={
              flow === "signIn"
                ? "Créer un compte avec email"
                : "J’ai déjà un compte"
            }
            onPress={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
            variant="secondary"
          />
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
