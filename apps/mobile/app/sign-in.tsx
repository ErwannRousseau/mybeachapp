import { Stack } from "expo-router";
import { ScrollView, Text, TextInput, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { PrimaryButton } from "@/components/PrimaryButton";

export default function SignInScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Connexion" }} />
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.section}>
          <Text selectable style={styles.title}>
            Se connecter
          </Text>
          <Text selectable style={styles.body}>
            Écran prêt pour le provider d’authentification choisi.
          </Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text selectable style={styles.label}>
            Email
          </Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="toi@example.com"
            placeholderTextColor="#6B7C86"
            style={styles.input}
          />
        </View>
        <PrimaryButton label="Continuer" />
      </ScrollView>
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
  label: {
    ...theme.typography.bodyStrong,
    color: theme.colors.onSurface,
  },
  section: {
    gap: theme.spacing.sm,
  },
  title: {
    ...theme.typography.headline,
    color: theme.colors.onSurface,
  },
}));
