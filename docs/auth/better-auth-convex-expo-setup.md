# Better Auth + Convex + Expo Auth Setup

This app uses email OTP as the primary MVP auth method. Native Google and Apple providers can stay available when configured, then send provider `idToken`s to Better Auth running on Convex.

## Current App Values

- Expo scheme: `mybeachapp`
- iOS bundle identifier: `app.mybeach.mobile`
- Android package: `app.mybeach.mobile`
- Google iOS client ID: `434244613471-2qh4iolluj86n6d8otil2hs4ic071h72.apps.googleusercontent.com`
- Google iOS URL scheme: `com.googleusercontent.apps.434244613471-2qh4iolluj86n6d8otil2hs4ic071h72`
- Convex client URL shape: `https://<deployment>.convex.cloud`
- Convex auth HTTP URL shape: `https://<deployment>.convex.site`

## 1. Convex Deployment Variables

Better Auth runs inside Convex. Deployment variables must be set with Convex, not only in a local `.env`.

Required:

```sh
bunx convex env set BETTER_AUTH_SECRET '<generated-secret>'
bunx convex env set RESEND_API_KEY '<resend-api-key>'
```

Generate a secret:

```sh
openssl rand -base64 32
```

Recommended for development:

```sh
bunx convex env set APP_ENV development
bunx convex env set AUTH_EMAIL_FROM 'My Beach App <auth@mybeach.app>'
bunx convex env set APPLE_APP_BUNDLE_IDENTIFIER app.mybeach.mobile
bunx convex env set GOOGLE_IOS_CLIENT_ID 434244613471-2qh4iolluj86n6d8otil2hs4ic071h72.apps.googleusercontent.com
bunx convex env set GOOGLE_WEB_CLIENT_ID '<google-web-client-id>'
```

Verify:

```sh
bunx convex env list
```

`SITE_URL` is optional. If omitted, the backend derives the `.convex.site` URL from Convex's `CONVEX_CLOUD_URL`.

## 2. Email OTP

Email OTP is the primary MVP auth flow:

- no password for MVP auth;
- 6 digit code;
- 10 minute validity;
- resend available after 30 seconds;
- sign-up and sign-in are merged: entering an email sends a code, and confirming the code creates the account if needed or opens the existing session.

Resend sends OTP emails. Production must have `RESEND_API_KEY` configured in Convex deployment variables. Development may log OTP codes only when explicitly implemented as a development fallback.

After OTP verification, Convex should create or reuse the Signed-in User's Beach Profile on the first authenticated app operation. Onboarding remains part of the MVP and completes the Beach Profile with:

- required pseudo;
- optional first name and last name;
- avatar;
- optional preferred activity categories;
- cities.

Pilot Zone is not asked during onboarding.

Cities MVP rules:

- use a select/search input backed by real French communes;
- use the official `geo.api.gouv.fr/communes` API as the data source;
- do not limit the user to a hardcoded local slug list;
- store INSEE `code`, `nom`, and `codePostal` when available;
- restrict the dataset to French cities for now;
- do not embed a full city dataset for MVP;
- add local caching later only if the API becomes a UX bottleneck.

Beach Profile visibility:

- public: pseudo, avatar, preferred activity categories, cities;
- private: first name, last name, email;
- Organizer and Participant UI displays pseudo and avatar only for the MVP.

Avatar MVP rules:

- upload from the photo library only;
- store with Convex file storage;
- crop or normalize to a square on mobile when practical;
- target display asset is 512x512;
- avatar is optional;
- when no avatar is set, show the pseudo initial.

Auth and onboarding routing:

- Visitors may view the map and list;
- after OTP verification, route to `/onboarding` when the Beach Profile is incomplete;
- route to `/(tabs)` when the Beach Profile is complete;
- a Beach Profile is incomplete when `pseudo` is missing;
- creating or joining a Beach Activity requires a complete Beach Profile;
- if a Visitor tries to create or join, require auth first, then onboarding when needed.

## 3. Mobile Environment Variables

Create or update `apps/mobile/.env.local`:

```sh
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_CONVEX_URL=https://<deployment>.convex.cloud
EXPO_PUBLIC_CONVEX_SITE_URL=https://<deployment>.convex.site
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=434244613471-2qh4iolluj86n6d8otil2hs4ic071h72.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
EXPO_PUBLIC_MAP_PROVIDER=placeholder
```

These variables are public and bundled into the Expo app.

## 4. Google Native Sign-In

Google uses `@react-native-google-signin/google-signin`.

### iOS

Already configured:

- OAuth client type: iOS
- Bundle ID: `app.mybeach.mobile`
- Client ID: `434244613471-2qh4iolluj86n6d8otil2hs4ic071h72.apps.googleusercontent.com`
- URL scheme in `apps/mobile/app.json`

Set the same iOS client ID in both places:

```sh
bunx convex env set GOOGLE_IOS_CLIENT_ID 434244613471-2qh4iolluj86n6d8otil2hs4ic071h72.apps.googleusercontent.com
```

```sh
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=434244613471-2qh4iolluj86n6d8otil2hs4ic071h72.apps.googleusercontent.com
```

### Android

Create Android OAuth client IDs in Google Cloud for each signing certificate you use.

For local debug builds:

```sh
cd apps/mobile/android
./gradlew signingReport
```

Use these values for the local prebuild debug client:

```txt
Package name: app.mybeach.mobile
SHA-1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
```

Then create or reuse a Web OAuth client ID. The native Android SDK needs this web client ID to request an ID token, and Better Auth uses the same ID as the accepted token audience:

```sh
bunx convex env set GOOGLE_WEB_CLIENT_ID '<google-web-client-id>'
```

```sh
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=<google-web-client-id>
```

Android will not show the Google button until `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` is set.

Do not put the Android OAuth client ID in Convex or Expo env. It only belongs in Google Cloud so Google can trust the Android package name and signing SHA-1. The current mobile flow does not use Google client secrets.

## 5. Apple Native Sign-In

Apple native auth uses `expo-apple-authentication`.

Required Apple Developer setup:

1. Register or confirm App ID for bundle identifier `app.mybeach.mobile`.
2. Enable “Sign in with Apple” on that App ID.
3. Make sure Xcode signing uses the same bundle ID and team.
4. Set Convex:

```sh
bunx convex env set APPLE_APP_BUNDLE_IDENTIFIER app.mybeach.mobile
```

Apple native Sign In is iOS-only in Expo. The app hides the Apple button on Android. If Android Apple sign-in is required later, that is a web OAuth flow with a Services ID and client secret, not this native flow.

## 6. Expo Prebuild

Native config plugins are declared in `apps/mobile/app.json`:

- `expo-apple-authentication`
- `@react-native-google-signin/google-signin`

After changing these values, regenerate native projects:

```sh
bun run --cwd apps/mobile native:prebuild
```

Then rebuild the dev client:

```sh
bun run --cwd apps/mobile ios
bun run --cwd apps/mobile android
```

This app uses Expo prebuild/dev-client flow, not Expo Go.

## 7. Verification Checklist

Run:

```sh
bun run check
bun run typecheck
bun run test
```

Manual checks:

- Email OTP request sends a 6 digit code.
- Email OTP verification creates a Better Auth user when the email is new.
- Email OTP verification opens the existing session when the email already exists.
- Email session persists after app restart.
- Sign-out returns to `/sign-in`.
- Google button appears on iOS when Convex has `GOOGLE_IOS_CLIENT_ID` and mobile has `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`.
- Google button appears on Android when Convex has `GOOGLE_WEB_CLIENT_ID` and mobile has `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`.
- Apple button appears on iOS when Convex has `APPLE_APP_BUNDLE_IDENTIFIER` and Apple capability is available.
- Apple button does not appear on Android.

## 8. Common Failures

Email OTP not received:

- Check `bunx convex env list` for `RESEND_API_KEY`.
- Check the configured sender domain in Resend.
- Check `AUTH_EMAIL_FROM`.
- Check Convex logs for Resend delivery errors.

No social button:

- Check `bunx convex env list`.
- Check `apps/mobile/.env.local`.
- Restart Metro after changing `EXPO_PUBLIC_*` values.
- Rebuild the dev client after changing native plugins or URL schemes.

Google `DEVELOPER_ERROR` on Android:

- Android OAuth client is missing or has the wrong SHA-1.
- Package name must be `app.mybeach.mobile`.
- Use `./gradlew signingReport` for local debug SHA-1.

Google returns no ID token:

- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` is missing.
- The web client ID is from another Google Cloud project.

Apple invalid audience:

- Convex `APPLE_APP_BUNDLE_IDENTIFIER` must be `app.mybeach.mobile`.
- Xcode bundle identifier must be `app.mybeach.mobile`.

Session does not reach Convex queries:

- Mobile must use `EXPO_PUBLIC_CONVEX_URL` for the Convex client.
- Mobile must use `EXPO_PUBLIC_CONVEX_SITE_URL` for the Better Auth HTTP client.
