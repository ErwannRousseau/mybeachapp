import { z } from "zod";

const COMMUNES_SEARCH_URL = "https://geo.api.gouv.fr/communes";
const IGN_SEARCH_URL = "https://data.geopf.fr/geocodage/search";

const coordinatesSchema = z.tuple([
  z.number().finite().min(-180).max(180),
  z.number().finite().min(-90).max(90),
]);

const communeResponseSchema = z.array(
  z.object({
    centre: z.object({
      coordinates: coordinatesSchema,
      type: z.literal("Point"),
    }),
    code: z.string().min(1),
    departement: z
      .object({
        code: z.string().min(1),
        nom: z.string().trim().min(1),
      })
      .optional(),
    nom: z.string().trim().min(1),
  }),
);

const ignResponseSchema = z.object({
  features: z.array(
    z.object({
      geometry: z.object({
        coordinates: coordinatesSchema,
        type: z.literal("Point"),
      }),
      properties: z.object({
        city: z.string().optional(),
        citycode: z.string().optional(),
        id: z.string().min(1).optional(),
        label: z.string().trim().min(1),
        type: z.string().optional(),
      }),
      type: z.literal("Feature"),
    }),
  ),
  type: z.literal("FeatureCollection"),
});

export type PlaceCandidate = {
  coordinates: [longitude: number, latitude: number];
  id: string;
  kind: "address" | "city" | "place";
  label: string;
  provider: "communes" | "ign";
};

export type PlaceSearchResult = {
  candidates: PlaceCandidate[];
  failedProviders: PlaceCandidate["provider"][];
};

export type PlaceSearchOptions = {
  signal?: AbortSignal;
};

export type PlaceSearchStatus =
  | "empty"
  | "error"
  | "idle"
  | "loading"
  | "ready";

export type SearchPlaces = (
  query: string,
  options?: PlaceSearchOptions,
) => Promise<PlaceSearchResult>;

export async function searchPlaces(
  query: string,
  options: PlaceSearchOptions = {},
): Promise<PlaceSearchResult> {
  const normalizedQuery = z.string().trim().min(3).parse(query);
  const communesUrl = new URL(COMMUNES_SEARCH_URL);
  communesUrl.searchParams.set("nom", normalizedQuery);
  communesUrl.searchParams.set("boost", "population");
  communesUrl.searchParams.set("fields", "nom,code,departement,centre");
  communesUrl.searchParams.set("format", "json");
  communesUrl.searchParams.set("limit", "6");

  const ignUrl = new URL(IGN_SEARCH_URL);
  ignUrl.searchParams.set("q", normalizedQuery);
  ignUrl.searchParams.set("limit", "6");

  const controller = new AbortController();
  const abortFromCaller = () => controller.abort();
  options.signal?.addEventListener("abort", abortFromCaller, { once: true });
  if (options.signal?.aborted) {
    controller.abort();
  }
  const timeout = setTimeout(() => controller.abort(), 5_000);

  const [communes, ign] = await Promise.allSettled([
    fetchCommuneCandidates(communesUrl, controller.signal),
    fetchIgnCandidates(ignUrl, controller.signal),
  ]).finally(() => {
    clearTimeout(timeout);
    options.signal?.removeEventListener("abort", abortFromCaller);
  });

  return {
    candidates: deduplicateCandidates([
      ...(communes.status === "fulfilled" ? communes.value : []),
      ...(ign.status === "fulfilled" ? ign.value : []),
    ]),
    failedProviders: [
      ...(communes.status === "rejected" ? (["communes"] as const) : []),
      ...(ign.status === "rejected" ? (["ign"] as const) : []),
    ],
  };
}

function deduplicateCandidates(candidates: PlaceCandidate[]) {
  const seen = new Set<string>();

  return candidates
    .filter((candidate) => {
      const key = `${candidate.label.toLocaleLowerCase("fr")}:${candidate.coordinates
        .map((coordinate) => coordinate.toFixed(5))
        .join(":")}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .slice(0, 6);
}

async function fetchCommuneCandidates(
  url: URL,
  signal: AbortSignal,
): Promise<PlaceCandidate[]> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`communes_http_${response.status}`);
  }

  return communeResponseSchema.parse(await response.json()).map(
    (commune): PlaceCandidate => ({
      coordinates: commune.centre.coordinates,
      id: `communes:${commune.code}`,
      kind: "city",
      label: commune.departement
        ? `${commune.nom}, ${commune.departement.nom}`
        : commune.nom,
      provider: "communes",
    }),
  );
}

async function fetchIgnCandidates(
  url: URL,
  signal: AbortSignal,
): Promise<PlaceCandidate[]> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`ign_http_${response.status}`);
  }

  return ignResponseSchema.parse(await response.json()).features.map(
    (feature): PlaceCandidate => ({
      coordinates: feature.geometry.coordinates,
      id: `ign:${feature.properties.id ?? feature.geometry.coordinates.join(":")}`,
      kind:
        feature.properties.type === "housenumber" ||
        feature.properties.type === "street"
          ? "address"
          : "place",
      label: feature.properties.label,
      provider: "ign",
    }),
  );
}
