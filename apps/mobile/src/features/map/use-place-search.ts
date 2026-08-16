import { useCallback, useEffect, useRef, useState } from "react";

import type {
  PlaceCandidate,
  PlaceSearchStatus,
  SearchPlaces,
} from "@/src/features/map/place-search";

const SEARCH_DEBOUNCE_MS = 300;

type UsePlaceSearchOptions = {
  onSelect: (candidate: PlaceCandidate) => void;
  search: SearchPlaces;
};

export function usePlaceSearch({ onSelect, search }: UsePlaceSearchOptions) {
  const [attempt, setAttempt] = useState(0);
  const [candidates, setCandidates] = useState<PlaceCandidate[]>([]);
  const [failedProviderCount, setFailedProviderCount] = useState(0);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<PlaceSearchStatus>("idle");
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
      attempt > 0 ? 0 : SEARCH_DEBOUNCE_MS,
    );

    return () => {
      clearTimeout(timeout);
      controller.abort();
      if (latestRequest.current === request) {
        latestRequest.current += 1;
      }
    };
  }, [attempt, query, search]);

  return {
    candidates,
    changeQuery,
    failedProviderCount,
    query,
    retrySearch,
    selectCandidate,
    status,
  };
}
