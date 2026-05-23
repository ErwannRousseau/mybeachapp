import { Link, Stack } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { PrimaryButton } from "@/components/PrimaryButton";
import { signOutAndRedirect, useAuthSession } from "@/src/auth/session";

export default function ProfileScreen() {
  const { data: session, isPending } = useAuthSession();

  return (
    <>
      <Stack.Screen options={{ title: "Profil" }} />
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.card}>
          <Text selectable style={styles.title}>
            {session ? "Profil connecté" : "Profil invité"}
          </Text>
          <Text selectable style={styles.body}>
            {isPending
              ? "Vérification de la session en cours."
              : session
                ? (session.user.email ?? "Ta session Better Auth est active.")
                : "Connecte-toi pour créer et rejoindre des activités."}
          </Text>
        </View>
        {session ? (
          <PrimaryButton
            label="Se déconnecter"
            onPress={() => void signOutAndRedirect()}
            variant="secondary"
          />
        ) : (
          <View style={styles.authActions}>
            <Link asChild href="/sign-in">
              <PrimaryButton label="Se connecter" />
            </Link>
            <Link asChild href="/sign-up">
              <PrimaryButton label="Créer un compte" variant="secondary" />
            </Link>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  authActions: {
    gap: theme.spacing.sm,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.onSurfaceMuted,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xl,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  content: {
    backgroundColor: theme.colors.background,
    gap: theme.spacing.lg,
    padding: theme.spacing.md,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.onSurface,
  },
}));
