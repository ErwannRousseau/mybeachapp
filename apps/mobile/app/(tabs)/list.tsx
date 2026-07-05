import { List } from "@tamagui/lucide-icons-2";
import { Link, Stack } from "expo-router";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t("navigation.list") }} />
      <TabScreenScrollView>
        <YStack gap="$lg" p="$md" pb="$md">
          <YStack gap="$sm">
            <Title selectable>{t("activities.list.title")}</Title>
            <Text selectable variant="muted">
              {t("activities.list.description")}
            </Text>
          </YStack>

          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <List color="$accent" size={26} />
              </EmptyMedia>
              <EmptyTitle>{t("activities.list.emptyTitle")}</EmptyTitle>
              <EmptyDescription>
                {t("activities.list.emptyDescription")}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Link asChild href="/create">
                <Button>{t("activities.list.create")}</Button>
              </Link>
            </EmptyContent>
          </Empty>
        </YStack>
      </TabScreenScrollView>
    </>
  );
}
