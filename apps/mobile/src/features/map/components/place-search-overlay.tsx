import { useTranslation } from "react-i18next";
import { YStack } from "tamagui";
import { PlaceSearchResultRow } from "@/src/features/map/components/place-search-result-row";
import {
  type PlaceCandidate,
  type SearchPlaces,
  searchPlaces,
} from "@/src/features/map/place-search";
import { usePlaceSearch } from "@/src/features/map/use-place-search";
import { SearchBar } from "@/ui/search-bar";
import { FloatingSurface } from "@/ui/surface";
import { Text } from "@/ui/typography";

export type PlaceSearchOverlayProps = {
  onSelect: (candidate: PlaceCandidate) => void;
  search?: SearchPlaces;
};

export function PlaceSearchOverlay({
  onSelect,
  search = searchPlaces,
}: PlaceSearchOverlayProps) {
  const { t } = useTranslation();
  const {
    candidates,
    changeQuery,
    failedProviderCount,
    query,
    retrySearch,
    selectCandidate,
    status,
  } = usePlaceSearch({ onSelect, search });

  return (
    <YStack gap="$sm">
      <SearchBar
        accessibilityLabel={t("activities.home.placeSearch.accessibilityLabel")}
        onChangeText={changeQuery}
        onSearch={retrySearch}
        placeholder={t("activities.home.searchPlaceholder")}
        value={query}
      />

      {status !== "idle" ? (
        <FloatingSurface gap="$xs" p="$xs">
          {status === "loading" ? (
            <Text p="$sm">{t("activities.home.placeSearch.loading")}</Text>
          ) : null}
          {status === "empty" ? (
            <Text p="$sm">{t("activities.home.placeSearch.empty")}</Text>
          ) : null}
          {status === "error" ? (
            <Text p="$sm">{t("activities.home.placeSearch.error")}</Text>
          ) : null}
          {status === "ready"
            ? candidates.map((candidate) => (
                <PlaceSearchResultRow
                  accessibilityLabel={t("activities.home.placeSearch.select", {
                    label: candidate.label,
                  })}
                  candidate={candidate}
                  key={candidate.id}
                  onSelect={selectCandidate}
                />
              ))
            : null}
          {status === "ready" && failedProviderCount > 0 ? (
            <Text p="$sm" size="sm" variant="muted">
              {t("activities.home.placeSearch.partial")}
            </Text>
          ) : null}
          {status === "ready" ? (
            <Text p="$sm" size="sm" variant="muted">
              {t("activities.home.placeSearch.attribution")}
            </Text>
          ) : null}
        </FloatingSurface>
      ) : null}
    </YStack>
  );
}
