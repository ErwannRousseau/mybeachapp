import { participationStatusSchema } from "./schemas";
import type { ParticipationStatus } from "./types";

export function isParticipationStatus(
  value: unknown,
): value is ParticipationStatus {
  return participationStatusSchema.safeParse(value).success;
}
