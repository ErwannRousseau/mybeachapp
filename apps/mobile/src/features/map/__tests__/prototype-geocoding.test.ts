import { describe, expect, it } from "vitest";

import {
  parseCommuneCandidates,
  parseIgnCandidates,
} from "../prototype-geocoding";

describe("prototype geocoding normalization", () => {
  it("normalizes IGN and commune results to longitude-latitude candidates", () => {
    expect(
      parseIgnCandidates({
        features: [
          {
            geometry: {
              coordinates: [-2.353059, 47.270832],
              type: "Point",
            },
            properties: {
              city: "Pornichet",
              citycode: "44132",
              label: "Plage des Libraires 44380 Pornichet",
              type: "locality",
            },
            type: "Feature",
          },
        ],
        type: "FeatureCollection",
      })[0],
    ).toMatchObject({
      coordinates: [-2.353059, 47.270832],
      label: "Plage des Libraires 44380 Pornichet",
      provider: "ign",
    });

    expect(
      parseCommuneCandidates([
        {
          centre: { coordinates: [-2.3225, 47.2599], type: "Point" },
          code: "44132",
          codesPostaux: ["44380"],
          nom: "Pornichet",
        },
      ])[0],
    ).toMatchObject({
      cityCode: "44132",
      coordinates: [-2.3225, 47.2599],
      provider: "communes",
    });
  });

  it("rejects invalid provider coordinates", () => {
    expect(() =>
      parseIgnCandidates({
        features: [
          {
            geometry: { coordinates: [999, 47], type: "Point" },
            properties: { label: "Invalid" },
            type: "Feature",
          },
        ],
        type: "FeatureCollection",
      }),
    ).toThrow();
  });
});
