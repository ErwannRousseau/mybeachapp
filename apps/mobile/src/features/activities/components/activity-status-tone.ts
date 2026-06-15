import type { ActivityStatus } from "@mybeachapp/shared/activities/types";

export type ActivityStatusTone = "destructive" | "muted" | "success";

export function getActivityStatusLabel(status: ActivityStatus) {
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
