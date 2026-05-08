export function getRemainingPlaces(
  maxParticipants: number,
  currentParticipantsCount: number,
): number {
  return Math.max(maxParticipants - currentParticipantsCount, 0);
}

export function isActivityJoinable(
  status: string,
  remainingPlaces: number,
): boolean {
  return status === "open" && remainingPlaces > 0;
}
