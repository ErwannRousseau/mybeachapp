import {
  ACTIVITY_CATEGORIES,
  ACTIVITY_MAX_PARTICIPANTS,
} from "@mybeachapp/shared/activities/constants";
import type { ActivityCategory } from "@mybeachapp/shared/activities/types";
import { Link, Stack } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { YStack } from "tamagui";

import { TabScreenScrollView } from "@/components/layout/TabScreenScrollView";
import { getActivityCategoryLabel } from "@/src/features/activities/activity-copy";
import { usePermissions } from "@/src/permissions/permissions";
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
  const permissions = usePermissions();
  const { t } = useTranslation();
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
      <Stack.Screen options={{ title: t("navigation.create") }} />
      <TabScreenScrollView>
        <YStack gap="$lg" p="$md" pb="$md">
          {permissions.isPending ? (
            <Card gap="$md">
              <Headline selectable>{t("common.loadingSession")}</Headline>
              <Text selectable variant="muted">
                {t("activities.create.authRequiredPending")}
              </Text>
            </Card>
          ) : !permissions.currentUser ? (
            <Card gap="$md">
              <Headline selectable>
                {t("activities.create.authRequiredTitle")}
              </Headline>
              <Text selectable variant="muted">
                {permissions.isPending
                  ? t("activities.create.authRequiredPending")
                  : t("activities.create.authRequiredDescription")}
              </Text>
              <YStack gap="$sm">
                {permissions.isPending ? (
                  <Button
                    disabled
                    loading
                    loadingLabel={t("common.loadingSession")}
                  >
                    {t("auth.actions.signIn")}
                  </Button>
                ) : (
                  <Link asChild href="/sign-in">
                    <Button>{t("auth.actions.signIn")}</Button>
                  </Link>
                )}
              </YStack>
            </Card>
          ) : !permissions.can("activity.create") ? (
            <Card gap="$md">
              <Headline selectable>
                {t("activities.create.authRequiredTitle")}
              </Headline>
              <Text selectable variant="muted">
                {t("activities.create.authRequiredDescription")}
              </Text>
            </Card>
          ) : (
            <>
              <YStack gap="$sm">
                <Headline selectable>
                  {t("activities.create.screenTitle")}
                </Headline>
                <Text selectable variant="muted">
                  {t("activities.create.screenDescription")}
                </Text>
              </YStack>

              <Field>
                <FieldLabel>{t("activities.create.title")}</FieldLabel>
                <Input placeholder={t("activities.create.titlePlaceholder")} />
              </Field>

              <Field>
                <FieldLabel>{t("activities.create.category")}</FieldLabel>
                <Button
                  haptic="selection"
                  onPress={openCategorySheet}
                  variant="secondary"
                >
                  {getActivityCategoryLabel(selectedCategory, t)}
                </Button>
              </Field>

              <Field>
                <FieldLabel>
                  {t("activities.create.maxParticipants")}
                </FieldLabel>
                <Input
                  defaultValue={String(defaultParticipants)}
                  keyboardType="number-pad"
                />
              </Field>

              <Button>{t("activities.create.prepare")}</Button>

              <Sheet
                onOpenChange={setCategorySheetOpen}
                open={categorySheetOpen}
              >
                <SheetHeader>
                  <SheetTitle>
                    {t("activities.create.categorySheetTitle")}
                  </SheetTitle>
                  <SheetDescription>
                    {t("activities.create.categorySheetDescription")}
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
                        t={t}
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
                    {t("activities.create.validate")}
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
  t: ReturnType<typeof useTranslation>["t"];
};

function ActivityCategoryChip({
  category,
  onSelect,
  selected,
  t,
}: ActivityCategoryChipProps) {
  const handlePress = useCallback(() => {
    onSelect(category);
  }, [category, onSelect]);

  return (
    <Chip onPress={handlePress} selected={selected}>
      {getActivityCategoryLabel(category, t)}
    </Chip>
  );
}
