import { z } from "zod";

const IGN_SEARCH_URL = "https://data.geopf.fr/geocodage/search";
const IGN_REVERSE_URL = "https://data.geopf.fr/geocodage/reverse";
const COMMUNES_URL = "https://geo.api.gouv.fr/communes";

const coordinateSchema = z.tuple([
  z.number().min(-180).max(180),
  z.number().min(-90).max(90),
]);

const ignResponseSchema = z.object({
  features: z.array(
    z.object({
      geometry: z.object({
        coordinates: coordinateSchema,
        type: z.literal("Point"),
      }),
      properties: z.object({
        city: z.string().optional(),
        citycode: z.string().optional(),
        label: z.string().trim().min(1),
        name: z.string().optional(),
        type: z.string().optional(),
      }),
      type: z.literal("Feature"),
    }),
  ),
  type: z.literal("FeatureCollection"),
});

const communesResponseSchema = z.array(
  z.object({
    centre: z.object({
      coordinates: coordinateSchema,
      type: z.literal("Point"),
    }),
    code: z.string().min(1),
    codesPostaux: z.array(z.string()),
    nom: z.string().trim().min(1),
  }),
);

export type PlaceCandidate = {
  city?: string;
  cityCode?: string;
  coordinates: [longitude: number, latitude: number];
  id: string;
  kind: string;
  label: string;
  provider: "communes" | "ign";
};

export type SearchPlacesResult = {
  candidates: PlaceCandidate[];
  communesMs: number;
  ignMs: number;
  totalMs: number;
};

type TimedResult<T> = {
  elapsedMs: number;
  value: T;
};

async function fetchJson(url: URL): Promise<TimedResult<unknown>> {
  const startedAt = performance.now();
  const response = await fetch(url);
  const elapsedMs = Math.round(performance.now() - startedAt);

  if (!response.ok) {
    throw new Error(`http_${response.status}`);
  }

  return { elapsedMs, value: await response.json() };
}

export function parseIgnCandidates(value: unknown): PlaceCandidate[] {
  return ignResponseSchema.parse(value).features.map((feature, index) => ({
    city: feature.properties.city,
    cityCode: feature.properties.citycode,
    coordinates: feature.geometry.coordinates,
    id: `ign-${feature.properties.citycode ?? "unknown"}-${index}`,
    kind: feature.properties.type ?? "place",
    label: feature.properties.label,
    provider: "ign" as const,
  }));
}

export function parseCommuneCandidates(value: unknown): PlaceCandidate[] {
  return communesResponseSchema.parse(value).map((commune) => ({
    city: commune.nom,
    cityCode: commune.code,
    coordinates: commune.centre.coordinates,
    id: `commune-${commune.code}`,
    kind: "municipality",
    label: `${commune.nom}${commune.codesPostaux[0] ? ` ${commune.codesPostaux[0]}` : ""}`,
    provider: "communes" as const,
  }));
}

export async function searchPlaces(query: string): Promise<SearchPlacesResult> {
  const normalizedQuery = query.trim();
  if (normalizedQuery.length < 2) {
    throw new Error("query_too_short");
  }

  const ignUrl = new URL(IGN_SEARCH_URL);
  ignUrl.searchParams.set("q", normalizedQuery);
  ignUrl.searchParams.set("limit", "6");

  const communesUrl = new URL(COMMUNES_URL);
  communesUrl.searchParams.set("nom", normalizedQuery);
  communesUrl.searchParams.set("fields", "nom,code,codesPostaux,centre");
  communesUrl.searchParams.set("boost", "population");
  communesUrl.searchParams.set("limit", "3");

  const startedAt = performance.now();
  const [ign, communes] = await Promise.all([
    fetchJson(ignUrl),
    fetchJson(communesUrl),
  ]);
  const seen = new Set<string>();
  const candidates = [
    ...parseIgnCandidates(ign.value),
    ...parseCommuneCandidates(communes.value),
  ].filter((candidate) => {
    const key = `${candidate.coordinates.join(",")}:${candidate.label}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });

  return {
    candidates,
    communesMs: communes.elapsedMs,
    ignMs: ign.elapsedMs,
    totalMs: Math.round(performance.now() - startedAt),
  };
}

export async function reverseGeocode(
  coordinates: [longitude: number, latitude: number],
): Promise<TimedResult<PlaceCandidate | null>> {
  coordinateSchema.parse(coordinates);
  const url = new URL(IGN_REVERSE_URL);
  url.searchParams.set("lon", String(coordinates[0]));
  url.searchParams.set("lat", String(coordinates[1]));
  url.searchParams.set("limit", "3");

  const response = await fetchJson(url);
  return {
    elapsedMs: response.elapsedMs,
    value: parseIgnCandidates(response.value)[0] ?? null,
  };
}
