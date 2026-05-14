import { Link, Stack } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { PrimaryButton } from "@/components/PrimaryButton";
import { getMobileEnv } from "@/src/config/env";

export default function ProfileScreen() {
  const mobileEnv = getMobileEnv();

  return (
    <>
      <Stack.Screen options={{ title: "Profil" }} />
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.card}>
          <Text selectable style={styles.title}>
            Profil invité
          </Text>
          <Text selectable style={styles.body}>
            Prêt pour brancher l’authentification. Mode actuel:
            {mobileEnv.authEnabled ? " activé" : " désactivé"}.
          </Text>
        </View>
        <Link asChild href="/sign-in">
          <PrimaryButton label="Se connecter" variant="secondary" />
        </Link>
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
