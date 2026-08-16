import { afterEach, describe, expect, it, vi } from "vitest";

import { searchPlaces } from "../place-search";

function jsonResponse(value: unknown): Response {
  return {
    json: async () => value,
    ok: true,
    status: 200,
  } as Response;
}

describe("searchPlaces", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("normalizes IGN places and official communes with longitude first", async () => {
    const fetchMock = vi.fn((input: string | URL | Request) => {
      const url = new URL(String(input));

      if (url.hostname === "geo.api.gouv.fr") {
        return Promise.resolve(
          jsonResponse([
            {
              _score: 1.128,
              centre: {
                coordinates: [-2.3225, 47.2599],
                type: "Point",
              },
              code: "44132",
              departement: {
                code: "44",
                nom: "Loire-Atlantique",
              },
              nom: "Pornichet",
            },
          ]),
        );
      }

      return Promise.resolve(
        jsonResponse({
          features: [
            {
              geometry: {
                coordinates: [-2.353059, 47.270832],
                type: "Point",
              },
              properties: {
                city: "Pornichet",
                citycode: "44132",
                id: "44132_plage_libraires",
                label: "Plage des Libraires 44380 Pornichet",
                type: "locality",
              },
              type: "Feature",
            },
          ],
          type: "FeatureCollection",
        }),
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(searchPlaces("  Pornichet  ")).resolves.toMatchObject({
      candidates: [
        {
          coordinates: [-2.3225, 47.2599],
          id: "communes:44132",
          kind: "city",
          label: "Pornichet, Loire-Atlantique",
          provider: "communes",
        },
        {
          coordinates: [-2.353059, 47.270832],
          id: "ign:44132_plage_libraires",
          kind: "place",
          label: "Plage des Libraires 44380 Pornichet",
          provider: "ign",
        },
      ],
      failedProviders: [],
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls.map(([input]) => String(input))).toEqual([
      "https://geo.api.gouv.fr/communes?nom=Pornichet&boost=population&fields=nom%2Ccode%2Cdepartement%2Ccentre&format=json&limit=6",
      "https://data.geopf.fr/geocodage/search?q=Pornichet&limit=6",
    ]);
  });

  it("keeps healthy commune results when IGN returns invalid data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((input: string | URL | Request) => {
        const url = new URL(String(input));
        return Promise.resolve(
          jsonResponse(
            url.hostname === "geo.api.gouv.fr"
              ? [
                  {
                    centre: {
                      coordinates: [-2.3225, 47.2599],
                      type: "Point",
                    },
                    code: "44132",
                    nom: "Pornichet",
                  },
                ]
              : {
                  features: [
                    {
                      geometry: {
                        coordinates: [999, 47.27],
                        type: "Point",
                      },
                      properties: { label: "Invalid" },
                      type: "Feature",
                    },
                  ],
                  type: "FeatureCollection",
                },
          ),
        );
      }),
    );

    await expect(searchPlaces("Pornichet")).resolves.toMatchObject({
      candidates: [
        {
          coordinates: [-2.3225, 47.2599],
          label: "Pornichet",
          provider: "communes",
        },
      ],
      failedProviders: ["ign"],
    });
  });

  it("deduplicates normalized candidates and limits display results", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((input: string | URL | Request) => {
        const url = new URL(String(input));
        if (url.hostname === "geo.api.gouv.fr") {
          return Promise.resolve(
            jsonResponse([
              {
                centre: {
                  coordinates: [-2.3225, 47.2599],
                  type: "Point",
                },
                code: "44132",
                nom: "Pornichet",
              },
            ]),
          );
        }

        return Promise.resolve(
          jsonResponse({
            features: Array.from({ length: 7 }, (_, index) => ({
              geometry: {
                coordinates:
                  index === 0
                    ? [-2.3225, 47.2599]
                    : [-2.33 - index / 100, 47.26],
                type: "Point",
              },
              properties: {
                id: `place-${index}`,
                label: index === 0 ? " pornichet " : `Plage ${index}`,
                type: "locality",
              },
              type: "Feature",
            })),
            type: "FeatureCollection",
          }),
        );
      }),
    );

    const result = await searchPlaces("Pornichet");

    expect(result.candidates).toHaveLength(6);
    expect(
      result.candidates.filter(
        (candidate) => candidate.label.trim().toLowerCase() === "pornichet",
      ),
    ).toHaveLength(1);
  });

  it("aborts hanging providers after five seconds without retrying", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(
      (_input: string | URL | Request, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener(
            "abort",
            () => reject(new DOMException("Aborted", "AbortError")),
            { once: true },
          );
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const resultPromise = searchPlaces("Pornichet");
    await vi.advanceTimersByTimeAsync(5_000);

    await expect(resultPromise).resolves.toEqual({
      candidates: [],
      failedProviders: ["communes", "ign"],
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
