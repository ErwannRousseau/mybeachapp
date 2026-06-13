import { Link, Stack } from "expo-router";
import { YStack } from "tamagui";

import { Text, Title } from "@/ui/typography";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Introuvable" }} />
      <YStack flex={1} items="center" justify="center" p="$lg">
        <Title selectable>Écran introuvable.</Title>
        <Link href="/(tabs)">
          <Text mt="$md" py="$md" selectable variant="accent">
            Retour à la carte
          </Text>
        </Link>
      </YStack>
    </>
  );
}
