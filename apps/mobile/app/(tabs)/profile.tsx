import { Link, Stack } from "expo-router";
import { useCallback } from "react";
import { XStack, YStack } from "tamagui";

import { TabScreenScrollView } from "@/components/layout/TabScreenScrollView";
import { signOut, useAuthSession } from "@/src/auth/session";
import { Avatar, AvatarFallback } from "@/ui/avatar";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Text, Title } from "@/ui/typography";

export default function ProfileScreen() {
  const { data: currentUser, isPending } = useAuthSession();
  const handleSignOut = useCallback(() => {
    void signOut();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: "Profil" }} />
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
                  {currentUser ? "Profil connecté" : "Profil invité"}
                </Title>
                <Text selectable variant="muted">
                  {isPending
                    ? "Vérification de la session en cours."
                    : currentUser
                      ? (currentUser.email ?? "Ta session est active.")
                      : "Connecte-toi pour créer et rejoindre des activités."}
                </Text>
              </YStack>
            </XStack>
            {currentUser ? (
              <Button onPress={handleSignOut} variant="secondary">
                Se déconnecter
              </Button>
            ) : (
              <YStack gap="$sm">
                {isPending ? (
                  <Button disabled loading loadingLabel="Vérification">
                    Se connecter
                  </Button>
                ) : (
                  <Link asChild href="/sign-in">
                    <Button>Se connecter</Button>
                  </Link>
                )}
                <Link asChild href="/sign-up">
                  <Button variant="secondary">Créer un compte</Button>
                </Link>
              </YStack>
            )}
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
