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
bunx convex env set AUTH_EMAIL_FROM 'My Beach App <auth@auth.erwannrousseau.dev>'
```

Generate a secret:

```sh
openssl rand -base64 32
```

Recommended for development:

```sh
bunx convex env set APP_ENV development
bunx convex env set AUTH_EMAIL_FROM 'My Beach App <auth@auth.erwannrousseau.dev>'
bunx convex env set APPLE_APP_BUNDLE_IDENTIFIER app.mybeach.mobile
bunx convex env set GOOGLE_IOS_CLIENT_ID 434244613471-2qh4iolluj86n6d8otil2hs4ic071h72.apps.googleusercontent.com
bunx convex env set GOOGLE_WEB_CLIENT_ID '<google-web-client-id>'
```

Verify:

```sh
bunx convex env list
```

`SITE_URL` is optional. If omitted, the backend derives the `.convex.site` URL from Convex's `CONVEX_CLOUD_URL`.

## 2. Resend Production Email Setup

Email OTP is transactional email. Production and preview must send from a verified Resend domain, not from the `resend.dev` sandbox and not only from Convex logs.

Chosen sending domain:

```txt
auth.erwannrousseau.dev
```

Chosen sender:

```txt
My Beach App <auth@auth.erwannrousseau.dev>
```

Resend domain ID:

```txt
85b1959e-3e83-4ff4-bb02-016bc724e7d4
```

Current preview Convex deployment:

```txt
dev:merry-caribou-4
```

Current status:

- Resend domain is verified.
- Resend open and click tracking are disabled.
- Convex `merry-caribou-4` currently has `APP_ENV=development`.
- Convex `merry-caribou-4` has `AUTH_EMAIL_FROM=My Beach App <auth@auth.erwannrousseau.dev>`.
- Convex `merry-caribou-4` has a Resend `sending_access` API key scoped to `auth.erwannrousseau.dev`.
- In `development`, OTP codes are logged and can be read through `GET /dev/auth/last-email-otp?email=...`; no Resend email is sent.
- In `preview` and `production`, OTP codes are sent through Resend with the React Email HTML template and a plain-text alternative.

Use a transactional subdomain instead of the root domain so SPF, DKIM, bounce handling, and reputation are isolated from the main website and any future marketing email.

### 2.1 What Can Be Done With The Resend CLI

The Resend CLI can:

- create the Resend domain and return DNS records;
- trigger verification;
- fetch the full domain record list and status;
- disable open and click tracking;
- create a domain-scoped sending API key;
- send a test email.

The Resend CLI cannot add DNS records at the DNS provider unless that provider is also automated separately. The DNS record creation step remains manual or provider-specific.

Install or verify the CLI:

```sh
resend --version
```

If missing:

```sh
npm install -g resend-cli
```

Authenticate with a bootstrap Resend API key. Do not put the literal key in shell history:

```sh
export RESEND_API_KEY='<temporary-full-access-resend-api-key>'
resend doctor -q
```

### 2.2 Create The Sending Domain

Create the domain in Resend:

```sh
resend domains create --name auth.erwannrousseau.dev --region eu-west-1 -q
```

Save the returned domain ID:

```sh
export RESEND_DOMAIN_ID='85b1959e-3e83-4ff4-bb02-016bc724e7d4'
```

Fetch the full DNS records:

```sh
resend domains get "$RESEND_DOMAIN_ID" -q
```

Add every returned DNS record at the DNS provider for `erwannrousseau.dev`. During setup, use a low TTL such as `300` seconds when the provider allows it.

Current Resend records to add:

| Purpose | Type | Host/name | Value | Priority | TTL |
| --- | --- | --- | --- | --- | --- |
| DKIM | TXT | `resend._domainkey.auth` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDVjAXxUchVxnshd3wOiL6rfMjRJDod0o317DommXgtJWNn6bM5a3YSUDpiUgFOMI87Qc8VLGgNtUo5wOKs02NJC86ve0e0AzL9OC36YjLtxA1RCPg8F4iSW9PyEgwl4SkduZyLgfmjphMtIWBKLAUU7WFb2yNLy0NWMjS7FaRkLwIDAQAB` | - | Auto |
| SPF bounce path | MX | `send.auth` | `feedback-smtp.eu-west-1.amazonses.com` | `10` | `60` |
| SPF | TXT | `send.auth` | `v=spf1 include:amazonses.com ~all` | - | `60` |

Important DNS notes:

- Add the records exactly as Resend returns them.
- If using Cloudflare, keep Resend CNAME records DNS-only, not proxied.
- Some DNS providers auto-append the root domain. If a record becomes duplicated, enter only the host portion or use the provider's trailing-dot convention.
- Keep any existing root-domain email setup separate. Do not move root MX records to Resend for this OTP-only flow.

After DNS records are added, trigger verification:

```sh
resend domains verify "$RESEND_DOMAIN_ID" -q
```

Poll until the domain is verified:

```sh
resend domains get "$RESEND_DOMAIN_ID" -q
```

Optional DNS checks:

```sh
dig TXT resend._domainkey.auth.erwannrousseau.dev +short
dig MX send.auth.erwannrousseau.dev +short
dig TXT send.auth.erwannrousseau.dev +short
dig TXT _dmarc.auth.erwannrousseau.dev +short
```

### 2.3 Tracking And Deliverability Settings

Disable open and click tracking for OTP email. Rewritten links and tracking pixels are unnecessary for sensitive transactional auth email and can hurt trust signals.

```sh
resend domains update "$RESEND_DOMAIN_ID" --no-open-tracking --no-click-tracking -q
```

Resend domain verification covers the provider-generated SPF and DKIM records. Add a DMARC record for the sending subdomain as well:

```txt
Host: _dmarc.auth
Type: TXT
Value: v=DMARC1; p=none; rua=mailto:dmarc@erwannrousseau.dev
```

Start with `p=none` to observe reports, then move toward stricter policy later when delivery is stable. If `dmarc@erwannrousseau.dev` is not a real mailbox or alias yet, either create it or temporarily omit `rua=...`.

### 2.4 Create The Production Sending Key

After `auth.erwannrousseau.dev` is verified, create a sending-only API key scoped to that domain:

```sh
resend api-keys create \
  --name mybeachapp-preview-auth-erwannrousseau \
  --permission sending_access \
  --domain-id "$RESEND_DOMAIN_ID" \
  -q
```

The token is returned once. Store it immediately in Convex:

```sh
export RESEND_SENDING_API_KEY='<token-returned-once-by-resend>'

bunx convex env set APP_ENV preview
bunx convex env set RESEND_API_KEY "$RESEND_SENDING_API_KEY"
bunx convex env set AUTH_EMAIL_FROM 'My Beach App <auth@auth.erwannrousseau.dev>'
```

For production, repeat on the production Convex deployment with `APP_ENV=production` and the final My Beach App sending domain.

### 2.5 Test Resend Before Testing The App

Send a Resend-level smoke test from the verified domain:

```sh
resend emails send \
  --from 'My Beach App <auth@auth.erwannrousseau.dev>' \
  --to delivered@resend.dev \
  --subject 'My Beach App email test' \
  --text 'Resend delivery test for My Beach App auth email.' \
  --idempotency-key 'mybeachapp-auth-domain-smoke-test' \
  -q
```

Then send to a real mailbox you control:

```sh
resend emails send \
  --from 'My Beach App <auth@auth.erwannrousseau.dev>' \
  --to '<your-real-email>' \
  --subject 'Ton code My Beach App' \
  --text 'Test de livraison OTP My Beach App.' \
  --idempotency-key 'mybeachapp-auth-real-mailbox-test' \
  -q
```

Do not test with fake Gmail, Outlook, or iCloud addresses. Hard bounces damage reputation.

Current validation:

- Resend-level smoke test from `My Beach App <auth@auth.erwannrousseau.dev>` to `delivered@resend.dev`: sent.
- Backend OTP smoke test through `https://merry-caribou-4.eu-west-1.convex.site/api/auth/email-otp/send-verification-otp`: returned `{"success":true}`.
- In `preview`, Resend logs showed the backend request as `POST /emails`, status `200`, `user_agent=Convex/1.0`.
- After switching back to `development`, a backend OTP request returned `{"success":true}`, the dev OTP route returned the code, and no new Convex `POST /emails` was created in Resend logs.

### 2.6 OTP Email Template

The backend renders the OTP email with React Email:

- component: `packages/backend/convex/betterAuth/emailOtpTemplate.tsx`;
- renderer: `packages/backend/convex/betterAuth/emailOtpRenderer.tsx`;
- sender integration: `packages/backend/convex/betterAuth/emailOtp.ts`.

Template rules:

- transactional only, no marketing content;
- French `tu` copy;
- subject: `Ton code My Beach App`;
- preview text under 90 characters;
- single-column layout;
- one clear H1;
- OTP shown as a large, copyable 6 digit code;
- expiration visible near the OTP;
- include "Si tu n'as pas demandé ce code, ignore cet email.";
- send both HTML and plain text;
- use `lang="fr"` and `dir="ltr"`;
- no tracking links;
- no heavy imagery until asset hosting is decided.

Development behavior is intentionally different from preview and production:

- `APP_ENV=development`: log the OTP and return before calling Resend;
- `APP_ENV=preview`: send the React Email HTML and plain-text email through Resend;
- `APP_ENV=production`: send the React Email HTML and plain-text email through Resend.

`email resend setup` or `npx react-email@latest resend setup` only connects the React Email CLI to a Resend account. Runtime sending in this app uses the Convex `RESEND_API_KEY` deployment variable, so the CLI setup is optional for local template previews and not required for the backend.

### 2.7 Sources

- [Resend CLI](https://resend.com/docs/cli)
- [Resend add a domain](https://resend.com/docs/add-a-domain)
- [Resend domain management](https://resend.com/docs/dashboard/domains/introduction)
- [Resend create API key](https://resend.com/docs/create-an-api-key)
- [Resend DMARC](https://resend.com/docs/dashboard/domains/dmarc)
- [Resend create domain API](https://resend.com/docs/api-reference/domains/create-domain)
- [Resend verify domain API](https://resend.com/docs/api-reference/domains/verify-domain)

## 3. Email OTP

Email OTP is the primary MVP auth flow:

- no password for MVP auth;
- 6 digit code;
- 10 minute validity;
- resend available after 30 seconds;
- sign-up and sign-in are merged: entering an email sends a code, and confirming the code creates the account if needed or opens the existing session.

Resend sends OTP emails. Production must have `RESEND_API_KEY` configured in Convex deployment variables. In development, the backend logs OTP codes in Convex logs and exposes the latest sign-in OTP for an email through:

```txt
GET /dev/auth/last-email-otp?email=toi@example.com
```

That development route returns `404` outside `APP_ENV=development`.

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

## 4. Mobile Environment Variables

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

## 5. Google Native Sign-In

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

## 6. Apple Native Sign-In

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

## 7. Expo Prebuild

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

## 8. Verification Checklist

Run:

```sh
bun run check
bun run typecheck
bun run test
```

Pre-merge gate:

- Set `APP_ENV=preview` on the target Convex deployment.
- Set `RESEND_API_KEY` on the target Convex deployment.
- Set `AUTH_EMAIL_FROM` to `My Beach App <auth@auth.erwannrousseau.dev>`.
- Confirm `auth.erwannrousseau.dev` is verified in Resend.
- Confirm open and click tracking are disabled for the OTP sending domain.
- Request an email OTP from the mobile app against that deployment.
- Confirm the OTP is received in a real mailbox, not only in Convex logs.
- Confirm the received OTP opens a session in the mobile app.
- Confirm `GET /dev/auth/last-email-otp?email=...` returns `404` on that deployment.

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

## 9. Common Failures

Email OTP not received:

- Check `bunx convex env list` for `RESEND_API_KEY`.
- Check the configured sender domain in Resend.
- Check `AUTH_EMAIL_FROM`.
- Check that `AUTH_EMAIL_FROM` uses the same verified domain as the Resend sending key.
- Check `resend domains get "$RESEND_DOMAIN_ID" -q`.
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
