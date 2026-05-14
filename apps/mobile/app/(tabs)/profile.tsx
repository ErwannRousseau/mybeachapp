import { useAuthActions, useConvexAuth } from "@convex-dev/auth/react";
import { Link, router, Stack } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { PrimaryButton } from "@/components/PrimaryButton";

export default function ProfileScreen() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();

  async function handleSignOut() {
    await signOut();
    router.replace("/sign-in");
  }

  return (
    <>
      <Stack.Screen options={{ title: "Profil" }} />
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.card}>
          <Text selectable style={styles.title}>
            {isAuthenticated ? "Profil connecté" : "Profil invité"}
          </Text>
          <Text selectable style={styles.body}>
            {isLoading
              ? "Vérification de la session en cours."
              : isAuthenticated
                ? "Ta session Convex Auth est active."
                : "Connecte-toi pour créer et rejoindre des activités."}
          </Text>
        </View>
        {isAuthenticated ? (
          <PrimaryButton
            label="Se déconnecter"
            onPress={() => void handleSignOut()}
            variant="secondary"
          />
        ) : (
          <Link asChild href="/sign-in">
            <PrimaryButton label="Se connecter" variant="secondary" />
          </Link>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
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
