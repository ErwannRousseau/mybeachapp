import {
  ACTIVITY_CATEGORIES,
  ACTIVITY_MAX_PARTICIPANTS,
} from "@mybeachapp/shared/activities/constants";
import type { ActivityCategory } from "@mybeachapp/shared/activities/types";
import { Link, Stack } from "expo-router";
import { useCallback, useState } from "react";
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
  const { data: currentUser, isPending } = useAuthSession();
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ActivityCategory>(defaultCategory);

  const openCategorySheet = useCallback(() => {
    setCategorySheetOpen(true);
  }, []);

  const closeCategorySheet = useCallback(() => {
    setCategorySheetOpen(false);
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: "Créer" }} />
      <TabScreenScrollView>
        <YStack gap="$lg" p="$md" pb="$md">
          {!currentUser ? (
            <Card gap="$md">
              <Headline selectable>
                Connecte-toi pour créer une activité
              </Headline>
              <Text selectable variant="muted">
                {isPending
                  ? "Vérification de ta session."
                  : "Connecte-toi avec ton email pour publier une activité et retrouver les participants."}
              </Text>
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
                  onPress={openCategorySheet}
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
                      <ActivityCategoryChip
                        category={category}
                        key={category}
                        onSelect={setSelectedCategory}
                        selected={selectedCategory === category}
                      />
                    ))}
                  </YStack>
                </SheetBody>
                <SheetActions>
                  <Button
                    haptic="selection"
                    onPress={closeCategorySheet}
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

type ActivityCategoryChipProps = {
  category: ActivityCategory;
  onSelect: (category: ActivityCategory) => void;
  selected: boolean;
};

function ActivityCategoryChip({
  category,
  onSelect,
  selected,
}: ActivityCategoryChipProps) {
  const handlePress = useCallback(() => {
    onSelect(category);
  }, [category, onSelect]);

  return (
    <Chip onPress={handlePress} selected={selected}>
      {activityCategoryLabels[category]}
    </Chip>
  );
}
