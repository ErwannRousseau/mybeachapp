import { Link, Stack } from "expo-router";
import { YStack } from "tamagui";

import { TabScreenScrollView } from "@/components/layout/TabScreenScrollView";
import { signOutAndRedirect, useAuthSession } from "@/src/auth/session";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Text, Title } from "@/ui/typography";

export default function ProfileScreen() {
  const { data: session, isPending } = useAuthSession();

  return (
    <>
      <Stack.Screen options={{ title: "Profil" }} />
      <TabScreenScrollView>
        <YStack gap="$lg" p="$md" pb="$md">
          <Card gap="$sm">
            <Title selectable>
              {session ? "Profil connecté" : "Profil invité"}
            </Title>
            <Text selectable variant="muted">
              {isPending
                ? "Vérification de la session en cours."
                : session
                  ? (session.user.email ?? "Ta session Better Auth est active.")
                  : "Connecte-toi pour créer et rejoindre des activités."}
            </Text>
            {session ? (
              <Button
                onPress={() => void signOutAndRedirect()}
                variant="secondary"
              >
                Se déconnecter
              </Button>
            ) : (
              <YStack gap="$sm">
                <Link asChild href="/sign-in">
                  <Button>Se connecter</Button>
                </Link>
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
