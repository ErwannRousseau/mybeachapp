import type { CameraRef } from "@maplibre/maplibre-react-native";
import { useCallback, useState } from "react";

import type { PlaceCandidate } from "@/src/features/map/place-search";

const PLACE_SELECTION_DURATION_MS = 600;
const PLACE_SELECTION_ZOOM = 14;

export function usePlaceSelection(
  cameraRef: React.RefObject<CameraRef | null>,
) {
  const [selectedPlace, setSelectedPlace] = useState<PlaceCandidate | null>(
    null,
  );
  const selectPlace = useCallback(
    (candidate: PlaceCandidate) => {
      setSelectedPlace(candidate);
      cameraRef.current?.easeTo({
        center: candidate.coordinates,
        duration: PLACE_SELECTION_DURATION_MS,
        zoom: PLACE_SELECTION_ZOOM,
      });
    },
    [cameraRef],
  );

  return { selectedPlace, selectPlace };
}
