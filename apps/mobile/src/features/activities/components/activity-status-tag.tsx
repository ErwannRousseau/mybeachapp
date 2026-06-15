import type { ActivityStatus } from "@mybeachapp/shared/activities/types";

import { Tag, type TagProps, type TagVariant } from "@/ui/tag";

export type ActivityStatusTagProps = Omit<TagProps, "children" | "variant"> & {
  status: ActivityStatus;
};

export function ActivityStatusTag({
  status,
  ...props
}: ActivityStatusTagProps) {
  return (
    <Tag variant={getActivityStatusVariant(status)} {...props}>
      {getActivityStatusLabel(status)}
    </Tag>
  );
}

function getActivityStatusLabel(status: ActivityStatus) {
  switch (status) {
    case "cancelled":
      return "Annulé";
    case "finished":
      return "Terminé";
    case "full":
      return "Complet";
    case "open":
      return "Ouvert";
  }
}

function getActivityStatusVariant(status: ActivityStatus): TagVariant {
  switch (status) {
    case "cancelled":
      return "destructive";
    case "finished":
    case "full":
      return "muted";
    case "open":
      return "success";
  }
}
