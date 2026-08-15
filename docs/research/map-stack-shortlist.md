---
status: research
topic: mobile map and geocoding shortlist
researched: 2026-08-15
branch: research/map-stack-shortlist
---

# Mobile map and geocoding shortlist

## Result

The two finalists use the same native renderer and differ only in their tile
provider. This keeps the prototype comparable and avoids coupling the UI to a
single data vendor:

1. **Finalist A (preferred for the €0 gate):** `@maplibre/maplibre-react-native`
   + OpenFreeMap vector tiles + Geoapify geocoding/reverse geocoding and
   autocomplete.
2. **Finalist B (preferred for provider integration):**
   `@maplibre/maplibre-react-native` + Geoapify vector tiles/styles + Geoapify
   geocoding/reverse geocoding and autocomplete.

Neither has a measured performance result yet. The two must be compared in a
real iOS and Android release prototype before the map issue is resolved. The
qualitative ranking below is based on the vendors' current technical and
commercial terms, not a claim about frame rate in this app.

## Gates and assumptions

The shortlist applies the constraints already validated for Wayfinder:

- iOS and Android, with one Expo/React Native implementation;
- production use at **€0**, without a payment card and without an automatic or
  surprise overage path;
- acceptable GDPR/privacy posture;
- a configurable, coherent custom UI (map style, layers, markers and controls);
- city, beach and address search, autocomplete, reverse geocoding and a
  manually movable GPS Pin for the exact Meeting Point;
- no offline maps in this MVP;
- map rendering and geocoding are separate replaceable services.

“Production” is treated strictly: a free tier restricted to personal,
non-commercial or evaluation use is not a finalist, even if it has generous
quotas. A free service that can throttle or discontinue is still financially
safe, but its availability risk is recorded rather than hidden.

## Common renderer: MapLibre React Native

[MapLibre React Native's setup guide](https://maplibre.org/maplibre-react-native/docs/setup/getting-started/)
documents a native iOS/Android wrapper around MapLibre Native. The current
11.x line requires React Native 0.80 or newer and New Architecture; the
repository's Expo SDK 56/RN 0.85 baseline satisfies those requirements. The
[v11 migration guide](https://maplibre.org/maplibre-react-native/docs/setup/migrations/v11/)
also documents the `MapView` to `Map` API change and the native rendering
options.

It is not an Expo Go feature. The
[Expo setup](https://maplibre.org/maplibre-react-native/docs/setup/expo/)
requires the package and config plugin, followed by a development/release
build. This is acceptable for the app, but is a real native-binary cost that
must be included in the prototype.

The [Map component API](https://maplibre.org/maplibre-react-native/docs/components/map/)
accepts a remote style URL or an inline StyleSpecification, exposes gesture
controls and preferred frame rate, and supports the native map controls. The
underlying [MapLibre Native project](https://maplibre.org/maplibre-native/)
provides GPU-backed iOS/Android rendering and full style/data control; the RN
wrapper is [MIT licensed](https://github.com/maplibre/maplibre-react-native)
and the native projects are open source. The latest release observed during
this research was [v11.3.6 on 2026-06-25](https://github.com/maplibre/maplibre-react-native/releases).

This gives both finalists the same UI and rendering surface: vector styles,
custom layers, custom markers/annotations, drag gestures for the GPS Pin and
provider-independent map controls. It does not make either tile service an SLA
or a performance guarantee.

## Finalist A — OpenFreeMap tiles + Geoapify geocoding

### Why it passes the hard gates

[OpenFreeMap](https://openfreemap.org/) states that its public instance is
free for websites and applications, has no map-view/request limit, needs no
registration, user database, cookies or API key, and permits commercial use.
It is based on OpenStreetMap/OpenMapTiles data; attribution to OpenStreetMap
and OpenMapTiles is required. The project and styles are open source (the
[project repository is MIT licensed](https://github.com/openfreemap/openfreemap)).

OpenFreeMap's [privacy page](https://openfreemap.org/privacy/) says there are
no accounts, tracking cookies or regular IP logs; its
[terms](https://openfreemap.org/tos/) are free and “as-is”. Therefore there is
no card, account billing or possible usage overage on the public endpoint.

Geoapify supplies the missing search layer. Its
[forward geocoding API](https://apidocs.geoapify.com/docs/geocoding/forward-geocoding/)
and [autocomplete service](https://www.geoapify.com/address-autocomplete/)
cover worldwide addresses, cities and POIs, with reverse geocoding available
through the same API family. The Free plan is advertised at $0, does not need
a card, supports up to 3,000 geocoding requests/day and accepts commercial use
with attribution, subject to the Free-plan limits. The provider documents a
GDPR-compliant EU endpoint and
short retention of request details; use `api-eu.geoapify.com` when EU-bound
processing is required ([privacy policy](https://www.geoapify.com/privacy-policy/),
[DPA](https://www.geoapify.com/data-processing-agreement/)).

### Strengths and risks

- **Financial/privacy:** strongest hard-gate fit. OpenFreeMap has no quota or
  key; Geoapify has no card and says Free-plan limits are soft with no
  surprise overage charges ([pricing checked 2026-08-15](https://www.geoapify.com/pricing/)).
- **UI/performance:** MapLibre's native vector renderer keeps styles and
  layers under app control; OpenFreeMap offers several ready styles that can
  be forked. No app-specific FPS or p95 measurement exists yet.
- **Operational risk:** OpenFreeMap has no SLA and its terms reserve the right
  to discontinue the public service without notice. Keep the style/tile URL
  configurable and retain Finalist B as a migration path. Geoapify can
  throttle a Free key when it exceeds soft limits.
- **Attribution:** render OpenStreetMap/OpenMapTiles and Geoapify attribution
  in the map UI and follow each provider's current terms.

## Finalist B — Geoapify tiles + Geoapify geocoding

### Why it passes the hard gates

[Geoapify map tiles](https://apidocs.geoapify.com/docs/maps/) expose
MapLibre-compatible `style.json` files with vector/raster styles such as
`osm-bright`, `osm-liberty` and `positron`. Colors and layers can be changed
in the style, so the same MapLibre UI remains customizable. The provider's
[pricing page](https://www.geoapify.com/pricing/) lists a $0 Free plan,
without a card, and no surprise overage charge: the service applies soft
limits/rate limiting instead of silently billing. The map API counts credits
(the current docs state 0.25 credit per tile); the Free allowance is 3,000
credits/day, so this is a finite availability budget even though it is not a
financial overage path.

The same account covers
[forward/reverse geocoding and autocomplete](https://www.geoapify.com/geocoding-api/),
with a documented 3,000 requests/day Free allowance, commercial use with
attribution, and EU/GDPR processing options. This is simpler to operate than
mixing two map providers and gives one style/data support path.

### Strengths and risks

- **Integration:** one vendor supplies style, tiles, autocomplete, forward
  geocoding and reverse geocoding. Switching style URLs does not change the
  MapLibre screen implementation.
- **UI/performance:** vector styles and CDN delivery are a good baseline for
  smooth native rendering; the actual first-render and pan/zoom metrics still
  require the release prototype.
- **Financial:** $0/no card/no surprise overage is compatible with the gate,
  but the daily credit and request limits can cause throttling or a blocked
  map when exceeded. The app must debounce autocomplete and cache appropriate
  results.
- **Key/privacy:** tile and search URLs need a key. Do not ship an unrestricted
  long-lived key in source; use the narrowest provider restrictions available
  or a small backend proxy, keep secrets in deployment configuration, and
  select the EU endpoint for EU-bound search/GPS data.
- **Attribution:** Geoapify, OpenMapTiles and OpenStreetMap attribution is
  required by the current Free-plan terms.

## Qualitative comparison

Scores are 1 (poor) to 5 (strong); “native complexity” is scored as ease of
shipping, so a higher number means less extra native work. They are hypotheses
for prioritising the release prototype, not benchmark measurements.

| Stack | €0/no overage | Privacy | Native rendering | Stability/continuity | UI/customisation | Expo/RN maintenance | Native complexity |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| A: MapLibre + OpenFreeMap + Geoapify search | 5 | 4 | 4 | 3 | 5 | 4 | 3 |
| B: MapLibre + Geoapify tiles/search | 4 | 4 | 4 | 4 | 5 | 4 | 3 |

Finalist A ranks first on the strict financial gate and avoids a tile API key,
while B ranks first on operational simplicity and a single support surface.
Neither score should be converted into a final decision without testing a
real release build on representative French coastal locations (at minimum
Pornichet and La Baule).

## Prototype acceptance plan

Build one iOS and one Android release/development-client binary with the same
MapLibre screen. Switch only the style/tile URL and geocoder adapter, then
record:

- cold first render and p95 search/reverse-geocode latency;
- pan/zoom/rotate smoothness, dropped frames and memory during a 10-minute
  session;
- marker/annotation rendering, cluster behaviour and drag precision for the
  manually movable GPS Pin;
- address, city, beach and POI results around Pornichet/La Baule, including a
  failed/ambiguous query and reverse geocoding of a moved Pin;
- behaviour at Geoapify soft limits and with a disabled OpenFreeMap endpoint;
- binary size, native build repeatability and attribution visibility;
- no key in source, logs or crash reports.

The map issue should choose the finalist only after these observations are
recorded. Keep the provider adapter and style URL in configuration so a tile
provider can be replaced without rewriting the map UI.

## Paid solutions that are genuinely stronger (benchmark only)

These products can offer better data, support, SLA or mature search/routing,
but they fail at least one validated hard gate. They are documented so a later
funded phase has an evidence-backed upgrade path.

| Product | Why it can be better | Why it is not a finalist now |
| --- | --- | --- |
| **Mapbox Maps SDK** | Mature native renderer, polished style tooling, large ecosystem and predictable mobile UX. | Mobile usage is pay-as-you-go after the free allowance (currently 25,000 MAU); [billing has no monthly spending cap](https://docs.mapbox.com/accounts/guides/pricing/), so it violates “no possible overage”. Its RN package is community-maintained ([official glossary](https://docs.mapbox.com/help/glossary/maps-sdk-for-react-native/)). |
| **Google Maps + Places** | Very familiar basemap, strong global POI/search data and native platform stability. | Android requires a Google Cloud billing account/API key ([billing docs](https://developers.google.com/maps/documentation/android-sdk/usage-and-billing)); paid events can follow free caps. Expo Maps uses Google on Android and Apple Maps on iOS ([Expo docs](https://docs.expo.dev/versions/v56.0.0/sdk/maps/)), which weakens one coherent cross-platform UI. |
| **HERE SDK** | High-quality native map/search/routing stack with enterprise support. | Current Base Plan onboarding requires a payment method and transaction billing; overage/commercial terms are possible ([current terms](https://www.here.com/terms)). React Native integration would require owning a native bridge, increasing binary and maintenance cost. |
| **Stadia Maps** | Good MapLibre-native integration and hosted basemaps; free tier has a hard stop rather than surprise overage. | Its Free tier is limited to non-commercial/development use; commercial production starts on paid plans ([pricing](https://stadiamaps.com/pricing), [limits](https://docs.stadiamaps.com/limits/)). |
| **MapTiler Cloud** | Strong cartographic data/style tooling and paid support, with MapLibre-compatible styles. | Free plan is personal/non-commercial and limited; commercial production requires a paid plan ([pricing](https://www.maptiler.com/cloud/pricing/), [terms](https://www.maptiler.com/terms/cloud/)). |

Raw OpenStreetMap tile servers and public Nominatim are not substitutes for
these finalists: the [OSMF tile policy](https://operations.osmfoundation.org/policies/tiles/)
warns of limited capacity/no SLA and possible blocking, while the
[Nominatim policy](https://operations.osmfoundation.org/policies/nominatim/)
limits the public service to roughly one request per second. They are useful
as data sources, not a production mobile service contract for this app.

All commercial terms, quotas and privacy statements above were checked against
the linked primary vendor sources on **2026-08-15**. Providers can change
terms; re-check them immediately before implementation and release.
