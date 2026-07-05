import { Link, Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, YStack } from "tamagui";

import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Headline, Text } from "@/ui/typography";

export default function OnboardingScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t("navigation.onboarding") }} />
      <ScrollView bg="$background" contentInsetAdjustmentBehavior="automatic">
        <YStack gap="$lg" p="$md">
          <Card gap="$md" p="$xl" rounded="$xxl">
            <Headline selectable>{t("onboarding.headline")}</Headline>
            <Text selectable variant="muted">
              {t("onboarding.body")}
            </Text>
          </Card>
          <Link asChild href="/(tabs)">
            <Button>{t("onboarding.cta")}</Button>
          </Link>
        </YStack>
      </ScrollView>
    </>
  );
}
