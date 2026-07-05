import { ACTIVITY_CATEGORIES } from "@mybeachapp/shared/activities/constants";
import { Link, Stack } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { XStack, YStack } from "tamagui";

import { TabScreenScrollView } from "@/components/layout/TabScreenScrollView";
import { env } from "@/src/config/env";
import { getActivityCategoryLabel } from "@/src/features/activities/activity-copy";
import { Button } from "@/ui/button";
import { Chip } from "@/ui/chip";
import { SearchBar } from "@/ui/search-bar";
import { Surface } from "@/ui/surface";
import { Tag } from "@/ui/tag";
import { Headline, Text, Title } from "@/ui/typography";

export default function Home() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedSearchQuery = searchQuery.trim();
  const mapStatusLabel =
    normalizedSearchQuery.length > 0
      ? t("activities.home.searchStatus", { query: normalizedSearchQuery })
      : t("activities.home.mapProvider", { provider: env.mapProvider });

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
                {t("activities.home.nearYou")}
              </Text>
              <Headline selectable>{t("activities.home.headline")}</Headline>
              <Text selectable variant="muted">
                {t("activities.home.mapReady")}
              </Text>
              <XStack flexWrap="wrap" gap="$xs" mt="auto">
                <Tag>{t("activities.home.providerReady")}</Tag>
                <Tag>{mapStatusLabel}</Tag>
              </XStack>
            </Surface>

            <YStack gap="$sm">
              <Title selectable size="sm">
                {t("activities.filters.mvp")}
              </Title>
              <XStack flexWrap="wrap" gap="$sm">
                {ACTIVITY_CATEGORIES.slice(0, 6).map((category, index) => (
                  <Chip key={category} selected={index === 0}>
                    {getActivityCategoryLabel(category, t)}
                  </Chip>
                ))}
              </XStack>
            </YStack>

            <Link asChild href="/create">
              <Button>{t("activities.home.create")}</Button>
            </Link>
          </YStack>
        </TabScreenScrollView>

        <YStack l="$md" position="absolute" r="$md" t={insets.top + 12} z={10}>
          <SearchBar
            onChangeText={setSearchQuery}
            onSearch={setSearchQuery}
            placeholder={t("activities.home.searchPlaceholder")}
          />
        </YStack>
      </YStack>
    </>
  );
}
