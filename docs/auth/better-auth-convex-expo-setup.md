# Better Auth + Convex + Expo Native Auth Setup

This app uses native provider SDKs on mobile, then sends provider `idToken`s to Better Auth running on Convex.

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
```

Generate a secret:

```sh
openssl rand -base64 32
```

Recommended for development:

```sh
bunx convex env set APP_ENV development
bunx convex env set APPLE_APP_BUNDLE_IDENTIFIER app.mybeach.mobile
bunx convex env set GOOGLE_IOS_CLIENT_ID 434244613471-2qh4iolluj86n6d8otil2hs4ic071h72.apps.googleusercontent.com
bunx convex env set GOOGLE_WEB_CLIENT_ID '<google-web-client-id>'
```

Verify:

```sh
bunx convex env list
```

`SITE_URL` is optional. If omitted, the backend derives the `.convex.site` URL from Convex's `CONVEX_CLOUD_URL`.

## 2. Mobile Environment Variables

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

## 3. Google Native Sign-In

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

## 4. Apple Native Sign-In

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

## 5. Expo Prebuild

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

## 6. Verification Checklist

Run:

```sh
bun run check
bun run typecheck
bun run test
```

Manual checks:

- Email sign-up creates a Better Auth user.
- Email sign-in persists after app restart.
- Sign-out returns to `/sign-in`.
- Google button appears on iOS when Convex has `GOOGLE_IOS_CLIENT_ID` and mobile has `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`.
- Google button appears on Android when Convex has `GOOGLE_WEB_CLIENT_ID` and mobile has `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`.
- Apple button appears on iOS when Convex has `APPLE_APP_BUNDLE_IDENTIFIER` and Apple capability is available.
- Apple button does not appear on Android.

## 7. Common Failures

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
