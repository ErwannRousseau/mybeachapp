import type { ActivityCategory } from "@mybeachapp/shared/activities/types";
import type { TFunction } from "i18next";

export function getActivityCategoryLabel(
  category: ActivityCategory,
  t: TFunction,
) {
  return t(`activities.categories.${category}`);
}
