import { ACTIVITY_CATEGORIES } from "@mybeachapp/shared/activities/constants";
import { Stack } from "expo-router";
import { YStack } from "tamagui";

import { TabScreenScrollView } from "@/components/layout/TabScreenScrollView";
import { activityCategoryLabels } from "@/src/features/activities/activity-copy";
import { Card } from "@/ui/card";
import { Text, Title } from "@/ui/typography";

export default function ActivityListScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Liste" }} />
      <TabScreenScrollView>
        <YStack gap="$lg" p="$md" pb="$md">
          <YStack gap="$sm">
            <Title selectable>Activités autour de toi</Title>
            <Text selectable variant="muted">
              Liste prête pour afficher les activités proches dès que Convex
              sera branché.
            </Text>
          </YStack>

          <YStack gap="$sm">
            {ACTIVITY_CATEGORIES.slice(0, 4).map((category) => (
              <Card gap="$xs" key={category}>
                <Title selectable size="sm">
                  {activityCategoryLabels[category]}
                </Title>
                <Text selectable variant="muted">
                  Aucune activité disponible pour le moment.
                </Text>
              </Card>
            ))}
          </YStack>
        </YStack>
      </TabScreenScrollView>
    </>
  );
}
