---
status: accepted
---

# Localization Boundary

My Beach App keeps backend activity data and filters as stable business keys, such as `ball_sport` or `open`, and localizes interface copy plus system data labels in the client. Convex should not return localized labels for normal app queries because that would mix product wording into backend data contracts, require locale-aware queries and cache behavior, and add complexity before more languages exist.

Backend localization is reserved for future server-owned communication, especially localized notifications.

The mobile app uses `i18next` with `react-i18next` for localization. This keeps dictionaries simple for the current French-only MVP, supports React hooks, pluralization, and interpolation, and can be reused later by backend notification code if server-side localization becomes necessary.

Rejected alternatives: a custom translation helper would be too limited once plurals and notifications arrive; Lingui adds extraction and compilation workflow before the app needs it; FormatJS is broader than the current React Native interface needs.
