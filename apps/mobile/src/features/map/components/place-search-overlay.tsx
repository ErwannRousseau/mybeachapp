import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { YStack } from "tamagui";

import {
  type PlaceCandidate,
  type PlaceSearchOptions,
  type PlaceSearchResult,
  searchPlaces,
} from "@/src/features/map/place-search";
import { SearchBar } from "@/ui/search-bar";
import { FloatingSurface } from "@/ui/surface";
import { Text } from "@/ui/typography";

type SearchPlaces = (
  query: string,
  options?: PlaceSearchOptions,
) => Promise<PlaceSearchResult>;

export type PlaceSearchOverlayProps = {
  onSelect: (candidate: PlaceCandidate) => void;
  search?: SearchPlaces;
};

export function PlaceSearchOverlay({
  onSelect,
  search = searchPlaces,
}: PlaceSearchOverlayProps) {
  const { t } = useTranslation();
  const [attempt, setAttempt] = useState(0);
  const [candidates, setCandidates] = useState<PlaceCandidate[]>([]);
  const [failedProviderCount, setFailedProviderCount] = useState(0);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<
    "empty" | "error" | "idle" | "loading" | "ready"
  >("idle");
  const latestRequest = useRef(0);
  const changeQuery = useCallback((value: string) => {
    setAttempt(0);
    setQuery(value);
  }, []);
  const retrySearch = useCallback(
    () => setAttempt((current) => current + 1),
    [],
  );
  const selectCandidate = useCallback(
    (candidate: PlaceCandidate) => {
      setCandidates([]);
      setStatus("idle");
      onSelect(candidate);
    },
    [onSelect],
  );

  useEffect(() => {
    const normalizedQuery = query.trim();
    const request = ++latestRequest.current;
    setCandidates([]);
    setFailedProviderCount(0);

    if (normalizedQuery.length < 3) {
      setStatus("idle");
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(
      () => {
        setStatus("loading");
        void search(normalizedQuery, { signal: controller.signal })
          .then((result) => {
            if (request !== latestRequest.current) {
              return;
            }
            setCandidates(result.candidates);
            setFailedProviderCount(result.failedProviders.length);
            setStatus(
              result.candidates.length > 0
                ? "ready"
                : result.failedProviders.length > 0
                  ? "error"
                  : "empty",
            );
          })
          .catch(() => {
            if (
              request === latestRequest.current &&
              !controller.signal.aborted
            ) {
              setStatus("error");
            }
          });
      },
      attempt > 0 ? 0 : 300,
    );

    return () => {
      clearTimeout(timeout);
      controller.abort();
      if (latestRequest.current === request) {
        latestRequest.current += 1;
      }
    };
  }, [attempt, query, search]);

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
