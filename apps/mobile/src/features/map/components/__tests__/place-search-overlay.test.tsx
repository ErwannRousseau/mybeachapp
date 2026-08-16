import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  findByProp,
  findByText,
  queryByText,
  renderWithTamagui,
} from "../../../../../test/render-with-tamagui";
import type { PlaceSearchResult } from "../../place-search";
import { PlaceSearchOverlay } from "../place-search-overlay";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((promiseResolve) => {
    resolve = promiseResolve;
  });
  return { promise, resolve };
}

describe("PlaceSearchOverlay", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("debounces searches from three characters and ignores stale results", async () => {
    vi.useFakeTimers();
    const first = deferred<PlaceSearchResult>();
    const second = deferred<PlaceSearchResult>();
    const search = vi
      .fn()
      .mockImplementationOnce(() => first.promise)
      .mockImplementationOnce(() => second.promise);
    const root = await renderWithTamagui(
      <PlaceSearchOverlay onSelect={vi.fn()} search={search} />,
    );
    const input = findByProp(root, "placeholder");

    await act(async () =>
      input.props.onChange({
        nativeEvent: { text: "Po" },
        target: { value: "Po" },
      }),
    );
    await act(async () => vi.advanceTimersByTimeAsync(300));
    expect(search).not.toHaveBeenCalled();

    await act(async () =>
      input.props.onChange({
        nativeEvent: { text: "Por" },
        target: { value: "Por" },
      }),
    );
    await act(async () => vi.advanceTimersByTimeAsync(299));
    expect(search).not.toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTimeAsync(1));
    expect(search).toHaveBeenCalledTimes(1);

    await act(async () =>
      input.props.onChange({
        nativeEvent: { text: "Porn" },
        target: { value: "Porn" },
      }),
    );
    await act(async () => vi.advanceTimersByTimeAsync(300));
    expect(search).toHaveBeenCalledTimes(2);

    await act(async () => {
      second.resolve({
        candidates: [
          {
            coordinates: [-2.3225, 47.2599],
            id: "communes:44132",
            kind: "city",
            label: "Pornichet, Loire-Atlantique",
            provider: "communes",
          },
        ],
        failedProviders: [],
      });
      await second.promise;
    });
    expect(findByText(root, "Pornichet, Loire-Atlantique")).toBeDefined();

    await act(async () => {
      first.resolve({
        candidates: [
          {
            coordinates: [-2.4, 47.3],
            id: "ign:stale",
            kind: "place",
            label: "Résultat obsolète",
            provider: "ign",
          },
        ],
        failedProviders: [],
      });
      await first.promise;
    });
    expect(queryByText(root, "Résultat obsolète")).toBeUndefined();
    expect(findByText(root, "Pornichet, Loire-Atlantique")).toBeDefined();
  });
});
