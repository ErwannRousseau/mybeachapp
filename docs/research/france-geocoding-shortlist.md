# France geocoding shortlist

> Research ticket: [Établir la shortlist des services de géocodage pour la France](https://github.com/ErwannRousseau/mybeachapp/issues/63)
>
> Checked: 2026-08-15. Sources are first-party documentation or live API responses. Pricing and terms are time-sensitive; re-check them before implementation.

## Decision boundary

The geocoder is independent from the mobile map renderer. It must support:

- forward search for a French city, beach/placename, or address;
- reverse lookup from the organizer's coordinates;
- production use with no card, no billing account, and no provider overage path;
- graceful manual entry when no search result or reverse label is available.

The app's domain remains explicit: a search result identifies a **Place**; the organizer's final coordinates are the source of truth for the **GPS Pin** and **Meeting Point**. A reverse-geocoded label is descriptive, not authority for the saved coordinates.

## Shortlist

| Service | Forward search | Reverse | Zero-cost / terms | Assessment |
| --- | --- | --- | --- | --- |
| **IGN Géoplateforme geocoding** | Address, named place, parcel; autocomplete is enabled by default. | Nearest address, toponym, parcel and/or administrative unit. | Public GET endpoints are documented; limit is 50 requests/second per source IP. The documentation does not describe a billing account, card, or metered overage for unit calls. | **Preferred candidate.** Best France fit: BAN addresses plus IGN BD TOPO POIs, independent of map rendering. Confirm operational availability and applicable CGU in the prototype. |
| **`geo.api.gouv.fr/communes`** | Commune name and postal-code lookup; name search can drive autocomplete. | Commune lookup from `lat`/`lon`. | Public French government API. The repository mandates it for city selection; no card or billing path is documented. | **Required companion**, not a beach/address geocoder. Store INSEE `code`, `nom`, and `codePostal` where present. |
| Geoapify | Addresses, cities and POIs; autocomplete and reverse APIs. | Yes. | Free plan: 3,000 credits/day, no card, up to 5 RPS, but “Limited Commercial Use”. Geoapify states free-plan limits are soft and may continue serving requests, with rate limiting for significant overuse. | Useful external fallback/benchmark, **not the zero-overage choice**. |
| Nominatim public (`nominatim.openstreetmap.org`) | OSM address/place search. | Yes. | Maximum 1 request/second; identifying User-Agent/Referer and attribution required. Client-side autocomplete is expressly forbidden; service capacity is limited and access may be withdrawn. | Reject as hosted MVP provider. Self-hosting is a separate infrastructure decision. |
| OpenCage | Geocoding API. | Yes. | Free trial: 2,500/day, 1 RPS, no card, permanent storage; explicitly “testing only”. | Reject for production. |
| Mapbox | Temporary geocoding and Search Box cover places/addresses/POIs. | Yes. | Temporary geocoding has 100,000 free requests/month; permanent geocoding has no free tier and requires a valid card or enterprise contract. Temporary results cannot be cached; durable Place/Meeting Point records therefore need an explicit permanent-geocoding/legal decision. | Paid quality benchmark, not eligible for the current constraint. |
| Google Maps Platform | Geocoding and Places autocomplete. | Yes. | Billing must be enabled. Geocoding has 10,000 free monthly events, then the global price list shows $5/1,000 events for the first paid tier. | Paid quality benchmark, not eligible. |
| HERE | Geocode, reverse geocode, search and autocomplete. | Yes. | Limited plan without payment information is capped at 1,000 requests/day and 5 RPS for geocode/reverse; HERE describes pay-as-you-grow usage beyond free limits. | Documented benchmark; not a hard zero-cost guarantee. |

### Sources for the shortlist

- [IGN Géoplateforme — Géocodage](https://geoservices.ign.fr/documentation/services/services-geoplateforme/geocodage) (modified 2026-07-28): endpoints, supported entities, source datasets, and 50-request/second IP limit.
- [geo.api.gouv.fr — Communes](https://geo.api.gouv.fr/decoupage-administratif/communes): `nom`, `codePostal`, `lat`/`lon`, `fields`, and GeoJSON query documentation.
- [BAN API documentation](https://doc.adresse.data.gouv.fr/docs/documentation-generale/naviguer-sur-le-site/les-api): free public API, French coverage, and debounce/throttle guidance.
- [BAN governance](https://adresse.data.gouv.fr/decouvrir-la-BAN): BAN as the official French address reference, IGN operation, and Etalab Open Licence.
- [Nominatim usage policy](https://operations.osmfoundation.org/policies/nominatim/): rate, attribution, privacy, autocomplete, and hosted-service restrictions.
- [Geoapify pricing](https://www.geoapify.com/pricing/) and [autocomplete terms/limits](https://www.geoapify.com/address-autocomplete/).
- [OpenCage pricing](https://opencagedata.com/pricing).
- [Mapbox geocoding](https://www.mapbox.com/geocoding), [pricing](https://www.mapbox.com/pricing), and [storage requirements](https://docs.mapbox.com/api/search/geocoding/).
- [Google Geocoding usage and billing](https://developers.google.com/maps/documentation/geocoding/usage-and-billing) and [global price list](https://developers.google.com/maps/billing-and-pricing/pricing).
- [HERE limited-plan RPS limits](https://www.here.com/get-started/pricing/rps-limits-excluded-use-cases) and [platform pricing](https://platform.here.com/portal/sign-up).

## France-specific evidence

The current IGN endpoint was queried on 2026-08-15:

```text
GET https://data.geopf.fr/geocodage/search?q=Plage%20des%20Libraires%20Pornichet&limit=3
```

It returned a GeoJSON feature with coordinates `[-2.353059, 47.270832]`, label `Plage des Libraires 44380 Pornichet`, type `locality`, city code `44132`, and city `Pornichet`. A city query returned `Pornichet` as a `municipality`; reverse lookup at those coordinates returned `Plage des Libraires` as a `locality`. These are live observations, not a service-level guarantee; keep the response fixture only in the prototype evidence, not production code.

## Recommended MVP shape

1. Use `geo.api.gouv.fr/communes` for onboarding/city selection and city filtering. Debounce search; keep the returned INSEE code and names as the stable city identity.
2. Put the IGN `search` and `reverse` calls behind a small geocoder adapter. The adapter accepts only search text or `{ latitude, longitude }` and returns normalized candidates; it knows nothing about Mapbox, Google, MapLibre, or native map rendering.
3. For activity creation, a selected result supplies the initial **Place** and coordinates. The organizer can still move the **GPS Pin**; save the final coordinates as the **Meeting Point**. Reverse lookup only proposes a human-readable label.
4. If search/reverse is unavailable, retain the manually selected coordinates and ask for a short manual meeting-point description. Do not block activity creation on a label lookup.
5. Enforce a client debounce and a server-side per-user/IP throttle below the documented 50 RPS limit. Do not call a provider for every keystroke. Add a provider switch only at the adapter boundary; do not add a second provider until the release prototype finds a concrete gap.

## Recommendation and gate

Shortlist outcome: **IGN Géoplateforme geocoding + `geo.api.gouv.fr/communes`** is the strongest current match for French address/city/placename coverage and the repository's no-card/no-billing direction without tying the geocoder to map rendering. Geoapify is the practical hosted fallback to benchmark, but its soft free limits and limited-commercial-use wording disqualify it from the hard zero-overage requirement. Nominatim remains useful as an OSM data/reference option, not as the public mobile autocomplete backend.

Before implementation is authorized, the separate prototype ticket must verify the two IGN flows on release iOS and Android builds, including a beach query, a city query, reverse lookup after GPS Pin drag, rate-limit handling, and manual fallback. Re-check the live IGN CGU/availability and all provider terms on the prototype date.
