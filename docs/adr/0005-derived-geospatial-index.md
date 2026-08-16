# Keep geospatial discovery derived from Beach Activities

Beach Activity records in `activities` remain canonical for discovery coordinates, status, and start date. `@convex-dev/geospatial` stores a reconstructible spatial index keyed by Activity ID; Activity mutations maintain it, and any divergence is repaired by rebuilding from canonical Activity records. Application mutations do not catch component write failures, so Activity and index changes commit or roll back together. This keeps domain ownership in Activities while giving viewport queries real spatial indexing.
