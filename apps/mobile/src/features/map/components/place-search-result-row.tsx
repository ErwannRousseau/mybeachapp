import { useCallback } from "react";
import { YStack } from "tamagui";

import type { PlaceCandidate } from "@/src/features/map/place-search";
import { Text } from "@/ui/typography";

export type PlaceSearchResultRowProps = {
  accessibilityLabel: string;
  candidate: PlaceCandidate;
  onSelect: (candidate: PlaceCandidate) => void;
};

export function PlaceSearchResultRow({
  accessibilityLabel,
  candidate,
  onSelect,
}: PlaceSearchResultRowProps) {
  const selectCandidate = useCallback(
    () => onSelect(candidate),
    [candidate, onSelect],
  );

  return (
    <YStack
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      minH="$touchMin"
      onPress={selectCandidate}
      p="$sm"
      pressStyle={{ bg: "$secondary" }}
      rounded="$md"
    >
      <Text weight="semibold">{candidate.label}</Text>
    </YStack>
  );
}
