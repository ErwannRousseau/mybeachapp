# Better Auth + Convex + Expo Setup

This guide lists what remains to make authentication work locally and on device.

## Current App Values

- Expo scheme: `mybeachapp`
- iOS bundle identifier: `app.mybeach.mobile`
- Android package: `app.mybeach.mobile`
- Convex client URL shape: `https://<deployment>.convex.cloud`
- Convex auth HTTP URL shape: `https://<deployment>.convex.site`

## 1. Convex Deployment Variables

Better Auth runs inside Convex. Secrets must be set on the Convex deployment, not only in a local `.env`.

Required:

```sh
bunx convex env set BETTER_AUTH_SECRET '<generated-secret>'
```

Generate a secret:

```sh
openssl rand -base64 32
```

Verify:

```sh
bunx convex env list
```

`SITE_URL` can be set on the Convex deployment to override the Better Auth `baseURL`.
If it is omitted, the backend derives the `.convex.site` URL from Convex's `CONVEX_CLOUD_URL`.

## 2. Mobile Environment Variables

Create or update `apps/mobile/.env.local`:

```sh
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_CONVEX_URL=https://<deployment>.convex.cloud
EXPO_PUBLIC_CONVEX_SITE_URL=https://<deployment>.convex.site
EXPO_PUBLIC_MAP_PROVIDER=placeholder
```

These variables are public and bundled into the Expo app.

## 3. Google OAuth

Create OAuth credentials in Google Cloud Console.

Recommended first pass for this codebase:

1. Create an OAuth consent screen.
2. Add test users while app is in testing mode.
3. Create a Web OAuth client.
4. Add authorized redirect URI:

```txt
https://<deployment>.convex.site/api/auth/callback/google
```

5. Set Convex deployment variables:

```sh
bunx convex env set GOOGLE_CLIENT_ID '<google-web-client-id>'
bunx convex env set GOOGLE_CLIENT_SECRET '<google-web-client-secret>'
```

6. Restart `convex dev` if it is running.

The mobile app discovers Google availability through `api.auth.getCapabilities`; the Google button appears only when both variables exist.

## 4. Apple OAuth

Apple Sign In needs Apple Developer account access.

Create Apple identifiers:

1. Register or confirm App ID for bundle identifier:

```txt
app.mybeach.mobile
```

2. Enable “Sign in with Apple” on the App ID.
3. Create a Services ID for the web OAuth client.
4. Configure return URL:

```txt
https://<deployment>.convex.site/api/auth/callback/apple
```

5. Create a Sign in with Apple private key.
6. Set Convex deployment variables expected by the current backend:

```sh
bunx convex env set APPLE_CLIENT_ID '<apple-services-id>'
bunx convex env set APPLE_CLIENT_SECRET '<apple-client-secret>'
```

The current backend expects a ready `APPLE_CLIENT_SECRET`. If you do not already have one, generate it as Apple’s ES256 client-secret JWT from:

- Team ID
- Services ID
- Key ID
- private key `.p8`

The Apple button appears only when both variables exist.

## 5. Deep Links And Trusted Origins

Configured in code:

```txt
mybeachapp://
mybeachapp://*
```

Development Expo origins are enabled only when Convex env has:

```sh
bunx convex env set APP_ENV development
```

Then trusted origins also include:

```txt
exp://
exp://**
exp://192.168.*.*:*/**
```

## 6. Run Locally

Backend:

```sh
bun run --cwd packages/backend dev
```

Mobile:

```sh
bun run --cwd apps/mobile ios
```

or:

```sh
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

These commands assume `apps/mobile/.env.local` is filled.

Manual checks:

- Email sign-up creates a Better Auth user.
- Email sign-in persists after app restart.
- Sign-out returns to `/sign-in`.
- Google button appears only after `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set.
- Apple button appears only after `APPLE_CLIENT_ID` and `APPLE_CLIENT_SECRET` are set.
- Creating a **Beach Activity** also creates the Organizer **Participation**.

## 8. Common Failures

No social button:

- Missing provider env vars in Convex deployment.
- Check `bunx convex env list`.

Convex auth route fails:

- Check `bunx convex env list` for `BETTER_AUTH_SECRET`.
- `SITE_URL` is optional, but if it exists it must point to the `.convex.site` deployment URL.
- OAuth buttons require complete provider pairs: ID and secret together.

OAuth redirect fails:

- Redirect URI in provider console must match `https://<deployment>.convex.site/api/auth/callback/<provider>`.
- Expo scheme must stay `mybeachapp`.

Session does not reach Convex queries:

- Mobile must use `EXPO_PUBLIC_CONVEX_URL` for Convex client.
- Mobile must use `EXPO_PUBLIC_CONVEX_SITE_URL` for Better Auth client.
