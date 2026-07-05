import type { ActivityStatus } from "@mybeachapp/shared/activities/types";
import { useTranslation } from "react-i18next";

import { Tag, type TagProps, type TagVariant } from "@/ui/tag";

import {
  type ActivityStatusTone,
  getActivityStatusTone,
} from "./activity-status-tone";

export type ActivityStatusTagProps = Omit<TagProps, "children" | "variant"> & {
  status: ActivityStatus;
};

export function ActivityStatusTag({
  status,
  ...props
}: ActivityStatusTagProps) {
  const { t } = useTranslation();

  return (
    <Tag variant={getActivityStatusVariant(status)} {...props}>
      {t(`activities.status.${status}`)}
    </Tag>
  );
}

function getActivityStatusVariant(status: ActivityStatus): TagVariant {
  return getTagVariantFromActivityTone(getActivityStatusTone(status));
}

function getTagVariantFromActivityTone(tone: ActivityStatusTone): TagVariant {
  switch (tone) {
    case "destructive":
      return "destructive";
    case "muted":
      return "muted";
    case "success":
      return "success";
  }
}
