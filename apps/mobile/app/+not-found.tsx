import { Link, Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { YStack } from "tamagui";

import { Text, Title } from "@/ui/typography";

export default function NotFoundScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t("common.notFound.title") }} />
      <YStack flex={1} items="center" justify="center" p="$lg">
        <Title selectable>{t("common.notFound.message")}</Title>
        <Link href="/(tabs)">
          <Text mt="$md" py="$md" selectable variant="accent">
            {t("common.notFound.backToMap")}
          </Text>
        </Link>
      </YStack>
    </>
  );
}
