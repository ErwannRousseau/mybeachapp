import { ACTIVITY_MAX_PARTICIPANTS } from "@mybeachapp/shared/activities/constants";
import { Link, Stack } from "expo-router";
import { YStack } from "tamagui";

import { TabScreenScrollView } from "@/components/layout/TabScreenScrollView";
import { useAuthSession } from "@/src/auth/session";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Field } from "@/ui/field";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Headline, Text } from "@/ui/typography";

const defaultParticipants = Math.min(8, ACTIVITY_MAX_PARTICIPANTS);

export default function CreateActivityScreen() {
  const { data: session, isPending } = useAuthSession();

  return (
    <>
      <Stack.Screen options={{ title: "Créer" }} />
      <TabScreenScrollView>
        <YStack gap="$lg" p="$md" pb="$md">
          {!session ? (
            <Card gap="$md">
              <Headline selectable>
                Connecte-toi pour créer une activité
              </Headline>
              <Text selectable variant="muted">
                {isPending
                  ? "Vérification de ta session."
                  : "La création reste visible dans la navigation, mais elle nécessite un compte pour publier dans Convex."}
              </Text>
              <YStack gap="$sm">
                <Link asChild href="/sign-in">
                  <Button>Se connecter</Button>
                </Link>
                <Link asChild href="/sign-up">
                  <Button variant="secondary">Créer un compte</Button>
                </Link>
              </YStack>
            </Card>
          ) : (
            <>
              <YStack gap="$sm">
                <Headline selectable>Nouvelle activité</Headline>
                <Text selectable variant="muted">
                  Base d’écran prête pour relier validation partagée, auth et
                  mutation Convex.
                </Text>
              </YStack>

              <Field>
                <Label>Titre</Label>
                <Input placeholder="Beach-volley à la plage centrale" />
              </Field>

              <Field>
                <Label>Participants max</Label>
                <Input
                  defaultValue={String(defaultParticipants)}
                  keyboardType="number-pad"
                />
              </Field>

              <Button>Préparer l’activité</Button>
            </>
          )}
        </YStack>
      </TabScreenScrollView>
    </>
  );
}
