import { ACTIVITY_CATEGORIES } from "@mybeachapp/shared/activities/constants";
import { Link, Stack } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { PrimaryButton } from "@/components/PrimaryButton";
import { mobileEnv } from "@/src/config/env";
import { activityCategoryLabels } from "@/src/features/activities/activity-copy";

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: "Carte" }} />
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.mapPreview}>
          <Text selectable style={styles.eyebrow}>
            Autour de toi
          </Text>
          <Text selectable style={styles.title}>
            Trouve une activité sur la plage
          </Text>
          <Text selectable style={styles.body}>
            Carte prête pour brancher le provider natif. Les données Convex se
            connecteront dès que l’URL publique sera configurée.
          </Text>
          <View style={styles.statusRow}>
            <Text selectable style={styles.statusBadge}>
              {mobileEnv.convexUrl ? "Convex prêt" : "Convex à configurer"}
            </Text>
            <Text selectable style={styles.statusBadge}>
              Carte: {mobileEnv.mapProvider}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text selectable style={styles.sectionTitle}>
            Filtres MVP
          </Text>
          <View style={styles.chipGrid}>
            {ACTIVITY_CATEGORIES.slice(0, 6).map((category) => (
              <Pressable key={category} style={styles.chip}>
                <Text selectable style={styles.chipText}>
                  {activityCategoryLabels[category]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Link asChild href="/create">
          <PrimaryButton label="Créer une activité" />
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
  chip: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.full,
    borderWidth: 1,
    minHeight: 36,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  chipText: {
    ...theme.typography.label,
    color: theme.colors.onSurface,
  },
  content: {
    backgroundColor: theme.colors.background,
    gap: theme.spacing.lg,
    padding: theme.spacing.md,
  },
  eyebrow: {
    ...theme.typography.label,
    color: theme.colors.secondary,
    textTransform: "uppercase",
  },
  mapPreview: {
    backgroundColor: theme.colors.secondarySoft,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xxl,
    borderWidth: 1,
    gap: theme.spacing.md,
    minHeight: 360,
    padding: theme.spacing.xl,
  },
  section: {
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    ...theme.typography.title,
    color: theme.colors.onSurface,
  },
  statusBadge: {
    ...theme.typography.label,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.full,
    color: theme.colors.onSurface,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
    marginTop: "auto",
  },
  title: {
    ...theme.typography.headline,
    color: theme.colors.onSurface,
  },
}));
