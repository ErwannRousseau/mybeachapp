import { ACTIVITY_MAX_PARTICIPANTS } from "@mybeachapp/shared/activities/constants";
import { Link, Stack } from "expo-router";
import { ScrollView, Text, TextInput, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { PrimaryButton } from "@/components/PrimaryButton";
import { useAuthSession } from "@/src/auth/session";

const defaultParticipants = Math.min(8, ACTIVITY_MAX_PARTICIPANTS);

export default function CreateActivityScreen() {
  const { data: session, isPending } = useAuthSession();

  return (
    <>
      <Stack.Screen options={{ title: "Créer" }} />
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        {!session ? (
          <View style={styles.authCard}>
            <Text selectable style={styles.title}>
              Connecte-toi pour créer une activité
            </Text>
            <Text selectable style={styles.body}>
              {isPending
                ? "Vérification de ta session."
                : "La création reste visible dans la navigation, mais elle nécessite un compte pour publier dans Convex."}
            </Text>
            <View style={styles.authActions}>
              <Link asChild href="/sign-in">
                <PrimaryButton label="Se connecter" />
              </Link>
              <Link asChild href="/sign-up">
                <PrimaryButton label="Créer un compte" variant="secondary" />
              </Link>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text selectable style={styles.title}>
                Nouvelle activité
              </Text>
              <Text selectable style={styles.body}>
                Base d’écran prête pour relier validation partagée, auth et
                mutation Convex.
              </Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text selectable style={styles.label}>
                Titre
              </Text>
              <TextInput
                placeholder="Beach-volley à la plage centrale"
                placeholderTextColor="#6B7C86"
                style={styles.input}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text selectable style={styles.label}>
                Participants max
              </Text>
              <TextInput
                defaultValue={String(defaultParticipants)}
                keyboardType="number-pad"
                placeholderTextColor="#6B7C86"
                style={styles.input}
              />
            </View>

            <PrimaryButton label="Préparer l’activité" />
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  authActions: {
    gap: theme.spacing.sm,
  },
  authCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xl,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.md,
  },
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
