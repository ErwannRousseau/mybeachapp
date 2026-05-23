import { Link, Stack } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { PrimaryButton } from "@/components/PrimaryButton";

export default function OnboardingScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Bienvenue" }} />
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.hero}>
          <Text selectable style={styles.title}>
            Rejoins une activité près de ta plage
          </Text>
          <Text selectable style={styles.body}>
            Découvre, crée et rejoins des sessions spontanées autour de toi.
          </Text>
        </View>
        <Link asChild href="/">
          <PrimaryButton label="Voir la carte" />
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
  content: {
    backgroundColor: theme.colors.background,
    gap: theme.spacing.lg,
    padding: theme.spacing.md,
  },
  hero: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xxl,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.xl,
  },
  title: {
    ...theme.typography.headline,
    color: theme.colors.onSurface,
  },
}));
