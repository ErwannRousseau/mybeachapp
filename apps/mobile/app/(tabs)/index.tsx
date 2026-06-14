import { ACTIVITY_CATEGORIES } from "@mybeachapp/shared/activities/constants";
import { Link, Stack } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { XStack, YStack } from "tamagui";

import { TabScreenScrollView } from "@/components/layout/TabScreenScrollView";
import { env } from "@/src/config/env";
import { activityCategoryLabels } from "@/src/features/activities/activity-copy";
import { Button } from "@/ui/button";
import { FilterChip } from "@/ui/filter-chip";
import { SearchBar } from "@/ui/search-bar";
import { Surface } from "@/ui/surface";
import { Tag } from "@/ui/tag";
import { Headline, Text, Title } from "@/ui/typography";

export default function Home() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedSearchQuery = searchQuery.trim();
  const mapStatusLabel =
    normalizedSearchQuery.length > 0
      ? `Recherche: ${normalizedSearchQuery}`
      : `Carte: ${env.mapProvider}`;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <YStack bg="$background" flex={1}>
        <TabScreenScrollView>
          <YStack gap="$lg" p="$md" pb="$md" pt={insets.top + 88}>
            <Surface
              bg="$secondary"
              gap="$md"
              minH={360}
              p="$xl"
              rounded="$xxl"
            >
              <Text
                selectable
                size="sm"
                textTransform="uppercase"
                variant="accent"
                weight="semibold"
              >
                Autour de toi
              </Text>
              <Headline selectable>Trouve une activité sur la plage</Headline>
              <Text selectable variant="muted">
                Carte prête pour brancher le provider natif. Les données Convex
                se connecteront dès que l’URL publique sera configurée.
              </Text>
              <XStack flexWrap="wrap" gap="$xs" mt="auto">
                <Tag>Convex prêt</Tag>
                <Tag>{mapStatusLabel}</Tag>
              </XStack>
            </Surface>

            <YStack gap="$sm">
              <Title selectable size="sm">
                Filtres MVP
              </Title>
              <XStack flexWrap="wrap" gap="$sm">
                {ACTIVITY_CATEGORIES.slice(0, 6).map((category, index) => (
                  <FilterChip key={category} selected={index === 0}>
                    {activityCategoryLabels[category]}
                  </FilterChip>
                ))}
              </XStack>
            </YStack>

            <Link asChild href="/create">
              <Button>Créer une activité</Button>
            </Link>
          </YStack>
        </TabScreenScrollView>

        <YStack l="$md" position="absolute" r="$md" t={insets.top + 12} z={10}>
          <SearchBar
            onChangeText={setSearchQuery}
            onSearch={setSearchQuery}
            placeholder="Pornichet, La Baule..."
          />
        </YStack>
      </YStack>
    </>
  );
}
