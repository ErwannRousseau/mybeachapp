import {
  ACTIVITY_CATEGORIES,
  ACTIVITY_MAX_PARTICIPANTS,
} from "@mybeachapp/shared/activities/constants";
import type { ActivityCategory } from "@mybeachapp/shared/activities/types";
import { Link, Stack } from "expo-router";
import { useState } from "react";
import { YStack } from "tamagui";
import { TabScreenScrollView } from "@/components/layout/TabScreenScrollView";
import { useAuthSession } from "@/src/auth/session";
import { activityCategoryLabels } from "@/src/features/activities/activity-copy";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Chip } from "@/ui/chip";
import { Field, FieldLabel } from "@/ui/field";
import { Input } from "@/ui/input";
import {
  Sheet,
  SheetActions,
  SheetBody,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/ui/sheet";
import { Headline, Text } from "@/ui/typography";

const defaultParticipants = Math.min(8, ACTIVITY_MAX_PARTICIPANTS);
const defaultCategory = ACTIVITY_CATEGORIES[0];

export default function CreateActivityScreen() {
  const { data: session, isPending } = useAuthSession();
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ActivityCategory>(defaultCategory);

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
                <FieldLabel>Titre</FieldLabel>
                <Input placeholder="Beach-volley à la plage centrale" />
              </Field>

              <Field>
                <FieldLabel>Catégorie</FieldLabel>
                <Button
                  haptic="selection"
                  onPress={() => setCategorySheetOpen(true)}
                  variant="secondary"
                >
                  {activityCategoryLabels[selectedCategory]}
                </Button>
              </Field>

              <Field>
                <FieldLabel>Participants max</FieldLabel>
                <Input
                  defaultValue={String(defaultParticipants)}
                  keyboardType="number-pad"
                />
              </Field>

              <Button>Préparer l’activité</Button>

              <Sheet
                onOpenChange={setCategorySheetOpen}
                open={categorySheetOpen}
              >
                <SheetHeader>
                  <SheetTitle>Choisis une catégorie</SheetTitle>
                  <SheetDescription>
                    Elle aide les autres participants à comprendre rapidement
                    l’activité.
                  </SheetDescription>
                </SheetHeader>
                <SheetBody>
                  <YStack gap="$sm">
                    {ACTIVITY_CATEGORIES.map((category) => (
                      <Chip
                        key={category}
                        onPress={() => setSelectedCategory(category)}
                        selected={selectedCategory === category}
                      >
                        {activityCategoryLabels[category]}
                      </Chip>
                    ))}
                  </YStack>
                </SheetBody>
                <SheetActions>
                  <Button
                    haptic="selection"
                    onPress={() => setCategorySheetOpen(false)}
                    variant="secondary"
                  >
                    Valider
                  </Button>
                </SheetActions>
              </Sheet>
            </>
          )}
        </YStack>
      </TabScreenScrollView>
    </>
  );
}
