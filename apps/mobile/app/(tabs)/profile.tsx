import { Link, Stack } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { XStack, YStack } from "tamagui";

import { TabScreenScrollView } from "@/components/layout/TabScreenScrollView";
import { signOut, useAuthSession } from "@/src/auth/session";
import { useLocale } from "@/src/localization/use-locale";
import { Avatar, AvatarFallback } from "@/ui/avatar";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Tag } from "@/ui/tag";
import { Text, Title } from "@/ui/typography";

export default function ProfileScreen() {
  const { data: currentUser, isPending } = useAuthSession();
  const { t } = useTranslation();
  const { currentLocale, localeLabels } = useLocale();
  const handleSignOut = useCallback(() => {
    void signOut();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: t("profile.title") }} />
      <TabScreenScrollView>
        <YStack gap="$lg" p="$md" pb="$md">
          <Card gap="$sm">
            <XStack gap="$sm" items="center">
              <Avatar>
                <AvatarFallback>
                  {getProfileFallback(currentUser?.email)}
                </AvatarFallback>
              </Avatar>
              <YStack flex={1} gap="$xxs" minW={0}>
                <Title selectable>
                  {currentUser
                    ? t("profile.signedInTitle")
                    : t("profile.guestTitle")}
                </Title>
                <Text selectable variant="muted">
                  {isPending
                    ? t("profile.sessionChecking")
                    : currentUser
                      ? (currentUser.email ?? t("profile.sessionActive"))
                      : t("profile.guestDescription")}
                </Text>
              </YStack>
            </XStack>
            {currentUser ? (
              <Button onPress={handleSignOut} variant="secondary">
                {t("profile.signOut")}
              </Button>
            ) : (
              <YStack gap="$sm">
                {isPending ? (
                  <Button
                    disabled
                    loading
                    loadingLabel={t("common.loadingSession")}
                  >
                    {t("profile.signIn")}
                  </Button>
                ) : (
                  <Link asChild href="/sign-in">
                    <Button>{t("profile.signIn")}</Button>
                  </Link>
                )}
                <Link asChild href="/sign-up">
                  <Button variant="secondary">
                    {t("profile.createAccount")}
                  </Button>
                </Link>
              </YStack>
            )}
          </Card>

          <Card gap="$sm">
            <Title selectable size="sm">
              {t("profile.languageTitle")}
            </Title>
            <XStack items="center" justify="space-between">
              <Text selectable>{localeLabels[currentLocale]}</Text>
              <Tag variant="success">{t("locale.current")}</Tag>
            </XStack>
          </Card>
        </YStack>
      </TabScreenScrollView>
    </>
  );
}

function getProfileFallback(email?: null | string) {
  const localPart = email?.split("@")[0]?.replace(/[^a-z0-9]/gi, "") ?? "";

  return localPart.length >= 2 ? localPart.slice(0, 2).toUpperCase() : "VI";
}
