import type { ActivityStatus } from "@mybeachapp/shared/activities/types";

export type ActivityStatusTone = "destructive" | "muted" | "success";

export function getActivityStatusTone(
  status: ActivityStatus,
): ActivityStatusTone {
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
