import type {
  ActivityCategory,
  ActivityStatus,
} from "@mybeachapp/shared/activities/types";
import type { TFunction } from "i18next";

export type ActivityStatusPresentation = {
  readonly label: string;
} & (
  | {
      readonly baseMapPinVisibility: "hidden";
      readonly tagTone: "destructive" | "muted";
    }
  | {
      readonly baseMapPinVisibility: "visible";
      readonly tagTone: "muted" | "success";
    }
);

type ActivityCategoryTranslationKey =
  `activities.categories.${ActivityCategory}`;
type ActivityStatusTranslationKey = `activities.status.${ActivityStatus}`;
type ActivityStatusPresentationDefinition = Omit<
  ActivityStatusPresentation,
  "label"
> & {
  readonly labelKey: ActivityStatusTranslationKey;
};

const activityCategoryTranslationKeys = {
  ball_sport: "activities.categories.ball_sport",
  beach_games: "activities.categories.beach_games",
  fitness_wellness: "activities.categories.fitness_wellness",
  other: "activities.categories.other",
  racket_sport: "activities.categories.racket_sport",
  social: "activities.categories.social",
  walking_running: "activities.categories.walking_running",
  water_sport: "activities.categories.water_sport",
} as const satisfies Record<ActivityCategory, ActivityCategoryTranslationKey>;

const activityStatusPresentations = {
  cancelled: {
    baseMapPinVisibility: "hidden",
    labelKey: "activities.status.cancelled",
    tagTone: "destructive",
  },
  finished: {
    baseMapPinVisibility: "hidden",
    labelKey: "activities.status.finished",
    tagTone: "muted",
  },
  full: {
    baseMapPinVisibility: "visible",
    labelKey: "activities.status.full",
    tagTone: "muted",
  },
  open: {
    baseMapPinVisibility: "visible",
    labelKey: "activities.status.open",
    tagTone: "success",
  },
} as const satisfies Record<
  ActivityStatus,
  ActivityStatusPresentationDefinition
>;

export function getActivityCategoryLabel(
  category: ActivityCategory,
  t: TFunction,
) {
  return t(activityCategoryTranslationKeys[category]);
}

export function formatActivityStartTime(startDateTime: number, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
  }).format(new Date(startDateTime));
}

export function getActivityStatusPresentation(
  status: ActivityStatus,
  t: TFunction,
): ActivityStatusPresentation {
  const { labelKey, ...presentation } = activityStatusPresentations[status];

  return {
    ...presentation,
    label: t(labelKey),
  };
}
