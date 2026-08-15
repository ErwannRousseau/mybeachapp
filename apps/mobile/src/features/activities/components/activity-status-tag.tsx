import type { ActivityStatus } from "@mybeachapp/shared/activities/types";
import { useTranslation } from "react-i18next";

import { Tag, type TagProps } from "@/ui/tag";

import { getActivityStatusPresentation } from "../activity-presentation";

export type ActivityStatusTagProps = Omit<TagProps, "children" | "variant"> & {
  status: ActivityStatus;
};

export function ActivityStatusTag({
  status,
  ...props
}: ActivityStatusTagProps) {
  const { t } = useTranslation();
  const presentation = getActivityStatusPresentation(status, t);

  return (
    <Tag variant={presentation.tagTone} {...props}>
      {presentation.label}
    </Tag>
  );
}
