import { Link, Stack } from "expo-router";
import { ScrollView, YStack } from "tamagui";

import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Headline, Text } from "@/ui/typography";

export default function OnboardingScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Bienvenue" }} />
      <ScrollView bg="$background" contentInsetAdjustmentBehavior="automatic">
        <YStack gap="$lg" p="$md">
          <Card gap="$md" p="$xl" rounded="$xxl">
            <Headline selectable>
              Rejoins une activité près de ta plage
            </Headline>
            <Text selectable variant="muted">
              Découvre, crée et rejoins des sessions spontanées autour de toi.
            </Text>
          </Card>
          <Link asChild href="/(tabs)">
            <Button>Voir la carte</Button>
          </Link>
        </YStack>
      </ScrollView>
    </>
  );
}
