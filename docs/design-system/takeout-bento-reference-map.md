---
status: draft
---

# Takeout Pro and Bento Reference Map

## Purpose

Takeout Pro and Bento are reference-only sources for improving the My Beach App mobile design system.

They can inspire Tamagui setup, theme structure, reusable UI primitives, auth/onboarding composition, and premium interaction patterns. They must not become runtime dependencies or architecture sources.

My Beach App keeps this MVP architecture:

- Expo + React Native + Expo Router for mobile navigation.
- Tamagui for the design system.
- Convex for backend, realtime, auth integration, and storage.
- Better Auth with `@convex-dev/better-auth` for auth.
- Email OTP as the primary auth method.

## Hard Boundaries

Do not copy or adopt:

- One routing.
- Zero.
- Drizzle.
- Postgres.
- Takeout backend/data/auth infrastructure.
- Takeout deployment or tunnel setup.
- Takeout scripts as project defaults.
- Bento demo files as-is.

Do not import files directly from:

- `/Users/erwannrousseau/Developer/takeout-pro`
- `/Users/erwannrousseau/Developer/bento`

Copy or adapt ideas into this repository only.

## Official Tamagui References

- Tamagui Theme Builder / theme generation: `https://tamagui.dev/docs/guides/theme-builder`
- Tamagui Bento: `https://tamagui.dev/bento`
- Tamagui UI primitives: `https://tamagui.dev/ui/intro`

The useful framing is:

- Theme Builder helps generate and iterate a coherent theme suite.
- Bento is copy-paste UI meant to be customized to the app design system.
- Tamagui UI gives composable primitive patterns, but the app should still own its components.

## Takeout Pro Map

Local reference path:

```txt
/Users/erwannrousseau/Developer/takeout-pro
```

### Tamagui Setup

Reference files:

```txt
src/tamagui/tamagui.config.ts
src/tamagui/themes.ts
src/tamagui/TamaguiRootProvider.tsx
docs/tamagui.md
```

Useful ideas:

- Keep Tamagui config explicit and typed.
- Generate a full theme suite from a small theme source.
- Keep provider setup isolated from screens.
- Use theme names intentionally instead of one-off colors.
- Prefer Tamagui tokens and variants over raw styles.

Adaptation for My Beach App:

- Keep Expo Router provider wiring in `apps/mobile/app/_layout.tsx`.
- Keep `DESIGN.md` as the product design source.
- Use Theme Builder or `createV5Theme` only to generate a maintainable Tamagui theme layer from My Beach tokens.
- Do not copy Takeout's One setup or web assumptions.

### Interface Components

Reference folders:

```txt
src/interface/buttons/
src/interface/forms/
src/interface/select/
src/interface/avatars/
src/interface/pages/
src/interface/keyboard/
src/interface/headers/
src/interface/navigation/
src/interface/dialogs/
```

Useful ideas:

- A dedicated `interface` layer separates reusable UI from feature logic.
- Components compose Tamagui primitives, context, variants, icons, and token-driven states.
- Form controls are wrapped once, then reused across screens.
- Page layouts and keyboard-aware primitives reduce repeated screen padding and footer logic.

Adaptation for My Beach App:

- Current target can stay `apps/mobile/ui`.
- If UI grows, evaluate `packages/ui` later.
- Rebuild primitives incrementally: `Button`, `Text`, `Input`, `Card`, `Tag`, `Chip`, `Avatar`, `Select`, `Sheet`, `OtpInput`, `Screen`, `KeyboardStickyFooter`.
- Keep components simpler than Takeout unless a real screen needs the extra behavior.

### Auth + OTP

Reference files:

```txt
src/features/auth/client/authClient.ts
src/features/auth/client/plugins.ts
src/features/auth/client/otpLogin.ts
src/features/auth/ui/OtpInput.tsx
src/features/auth/ui/LoginEmailButton.tsx
src/features/auth/ui/LoginLegalText.tsx
```

Useful ideas:

- Wrap OTP send/sign-in calls behind a small client API.
- Normalize Better Auth errors before they reach screens.
- Use a dedicated OTP input with paste support and one-time-code autocomplete.
- Keep login UI as small reusable pieces.

Adaptation for My Beach App:

- Use `better-auth/react`, `@better-auth/expo`, and `@convex-dev/better-auth/client/plugins`.
- Use Convex Better Auth provider and Convex HTTP routes.
- Implement only email OTP for MVP.
- Error messages must be French and customer-facing.
- Do not copy phone OTP, demo login, Takeout API handlers, or server auth setup.

### Onboarding

Reference files:

```txt
src/features/onboarding/Onboarding.native.tsx
src/features/onboarding/OnboardingSlide.tsx
src/features/onboarding/OnboardingActionButton.tsx
src/features/onboarding/OnboardingPageIndicator.tsx
src/features/onboarding/onboardingConfig.ts
src/features/onboarding/onboardingSlides.ts
src/features/onboarding/onboardingStorage.ts
```

Useful ideas:

- Native pager-based onboarding.
- Dedicated slide data config.
- Animated page indicator.
- Bottom action area respecting safe area.
- Theme-aware slides.

Adaptation for My Beach App:

- Onboarding is not marketing-only. It must complete the Beach Profile.
- Required: pseudo.
- Optional: first name, last name, avatar, preferred activities, cities.
- Cities are selected from real French communes, not fixed hardcoded slugs.
- Completion is stored in Convex through the user profile, not local-only storage.
- Expo Router owns the route flow.

### Takeout Docs and Skills

Reference files/folders:

```txt
CLAUDE.md
src/README.md
docs/tamagui.md
.claude/skills/takeout-tamagui/
.claude/skills/takeout-docs/
```

Useful ideas:

- Local docs can encode repo-specific conventions.
- Feature docs should explain where code belongs.
- Tamagui rules should be explicit enough to avoid visual drift.

Adaptation for My Beach App:

- Keep root `AGENTS.md`, `DESIGN.md`, ADRs, and feature docs as source of truth.
- Add only My Beach-specific docs. Do not copy Takeout skill assumptions.

## Bento Map

Local reference path:

```txt
/Users/erwannrousseau/Developer/bento
```

### High-Value References

```txt
forms/inputs/OneTimeCodeInput.tsx
forms/inputs/components/inputsParts.tsx
elements/avatars/components/Avatar.tsx
elements/chips/components/chipsParts.tsx
elements/buttons/
elements/pickers/ImagePicker.tsx
elements/pickers/UploadFile.tsx
panels/walkthrough/
shells/tabbars/
user/profile/ProfileView.tsx
```

Useful ideas:

- OTP input behavior and layout patterns.
- Avatar shape, fallback, and sizing patterns.
- Chip/tag sizing and compound component patterns.
- Image picker/upload UI for Avatar MVP.
- Walkthrough/onboarding composition ideas.
- Tab bar visual references.

Adaptation for My Beach App:

- Treat Bento as visual/component inspiration, not production-ready app code.
- Remove demo-only values and hardcoded colors.
- Rebuild with My Beach tokens and French copy.
- Avoid adding Bento's generic demo surface area before the MVP needs it.

## Recommended Migration Order

1. Stabilize the Tamagui theme architecture.
2. Update `DESIGN.md` tokens to match the chosen Tamagui theme model.
3. Update `apps/mobile/tamagui.config.ts` from the chosen tokens.
4. Rebuild core `apps/mobile/ui` primitives.
5. Build email OTP auth screens with the new primitives.
6. Build Beach Profile onboarding.
7. Use Convex mutations/queries for current user profile and activities.
8. Replace remaining one-off screen styling only when touched by a product flow.

## Smallest Vertical Slice

Validate this before broader UI migration:

```txt
Expo Router app boots
→ Tamagui provider is active
→ Convex provider is active
→ Better Auth Convex provider is active
→ user can request email OTP
→ user can sign in with OTP
→ app can read current user profile from Convex
→ onboarding collects required pseudo
→ app can create a test activity
→ app can list activities
```

## Open Design-System Decision

The next decision is the theme source of truth:

Option A:

Keep `DESIGN.md` as the product source of truth and upgrade its YAML tokens to a Tamagui-friendly 12-step scale generated or guided by Theme Builder.

Option B:

Adopt Takeout's theme structure first, then rebrand it into Beach Glass.

Recommendation:

Choose Option A. It keeps My Beach App's product identity and lets Theme Builder improve the technical theme structure without letting Takeout override the brand.
