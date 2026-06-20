import { List } from "@tamagui/lucide-icons-2";
import { Link, Stack } from "expo-router";
import { YStack } from "tamagui";

import { TabScreenScrollView } from "@/components/layout/TabScreenScrollView";
import { Button } from "@/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/ui/empty";
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

          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <List color="$accent" size={26} />
              </EmptyMedia>
              <EmptyTitle>Aucune activité pour le moment</EmptyTitle>
              <EmptyDescription>
                Les prochaines activités proches apparaîtront ici dès que Convex
                sera branché.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Link asChild href="/create">
                <Button>Créer une activité</Button>
              </Link>
            </EmptyContent>
          </Empty>
        </YStack>
      </TabScreenScrollView>
    </>
  );
}
