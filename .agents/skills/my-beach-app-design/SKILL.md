---
name: my-beach-app-design
description: Design, prototype, implement, or review My Beach App interfaces using the Tamagui-based Beach Glass design system in DESIGN.md. Use when Codex works on My Beach App mobile screens, map-first UX, Tamagui tokens/themes/components, Expo Router screens, React Native UI, Figma-to-RN implementation, or design QA for see/create/join beach activity flows.
---

# My Beach App Design

## Read order

1. Read `DESIGN.md` first.
2. Read the YAML frontmatter before prose; it is the canonical token source.
3. Treat `DESIGN.md` as the only local source of truth for brand, tokens, and component rules.
4. Read the local Tamagui configuration files before changing UI implementation.
5. If Tamagui-specific skills or docs are installed in the agent environment, read them before coding Tamagui components.
6. If implementing from Figma frames, read the Figma Integration section next.

## Default workflow

1. Extract the target screen, component, or artifact from the user request.
2. Anchor every proposal in the Beach Glass system from `DESIGN.md`.
3. Keep the output map-first, mobile-first, and centered on `see / create / join`.
4. Use French for customer-facing MVP copy.
5. Reuse semantic tokens and component patterns instead of inventing new UI language.
6. Implement reusable UI through Tamagui and `mobile/ui/` first.
7. Keep iOS and Android as close as possible by default.
8. Validate against the `Do's and Don'ts` section in `DESIGN.md` before finalizing.

## Hard rules

- Tamagui is the primary design-system foundation.
- Expo + React Native + Expo Router are the mobile app runtime baseline.
- Convex is the backend baseline.
- Better Auth is the auth baseline when auth work is involved.
- Coral `#FF6B4A` is for the main CTA only.
- Use one dominant Coral action per screen.
- No emoji in product UI.
- No decorative Unicode symbols.
- Build shared cross-platform UI first.
- Do not create separate iOS and Android component implementations unless there is a concrete need.
- Do not use Expo UI, SwiftUI, Jetpack Compose, Liquid Glass, or native materials as the default design-system foundation.
- Do not use `expo-blur` as the default surface system.
- Do not use `expo-glass-effect` as a design-system foundation.
- If a real blur or native effect is required later, isolate it in an explicit primitive such as `BackdropBlur` or `NativeEffectSurface`.
- Do not create or extend a default `GlassSurface` component. Use `Surface` and `FloatingSurface` for normal Tamagui surfaces.
- When implementing reusable UI primitives, prefer a flat Compound Component naming style such as `Sheet`, `SheetHeader`, `SheetBody`, `SheetActions`.
- Component exports must use `export function` declarations only.
- Do not use `const` component declarations for UI components.
- Do not use default exports for UI components.
- Do not add barrel files by default.
- Design-system source components must live in `mobile/ui/`.
- Minimum body text: 16 px.
- Minimum touch target: 44 px.
- Cards and search bars use 24 px radius.
- Bottom sheets use 32 px radius.
- Inputs use visible labels and clear borders.
- Do not add chat, payments, groups, reputation, or feed features unless explicitly requested.

## Tamagui implementation guidance

When creating or modifying production UI:

1. Inspect the existing Tamagui setup: `tamagui.config.ts`, provider setup, Expo Router root layout, and `mobile/ui/`.
2. Map design tokens from `DESIGN.md` into Tamagui tokens and themes before using raw values.
3. Prefer Tamagui props and tokens such as `$primary`, `$surface`, `$card`, `$xl`, `$md`, `$4`, or project equivalents.
4. Add or update a `mobile/ui/` component when a pattern is reused or carries design-system meaning.
5. Keep feature-specific composition inside the feature or route folder, but keep generic visual decisions in `mobile/ui/`.
6. Use Tamagui variants for real component states: `intent`, `size`, `selected`, `disabled`, `emphasis`, or `density`.
7. Avoid nested theme complexity until there is a proven need.
8. Avoid copying starter-kit architecture assumptions into the app. The app is not based on Takeout Pro, One, Zero, or Drizzle.

Prefer this layering:

```text
DESIGN.md tokens
        ↓
tamagui.config.ts
        ↓
mobile/ui/ primitives
        ↓
feature components
        ↓
Expo Router screens
```

## Figma Integration

**Figma is the visual design authority.** When translating a Figma frame to `mobile/ui/` or a mobile screen:

1. **Require frame URL:** Ask for the exact `figma.com/design/:fileKey/:name?node-id=:nodeId` if it is missing.
2. **Use Figma MCP:** Extract tokens, metadata, layout, and component structure via the `Figma` MCP connection.
3. **Map all tokens to `DESIGN.md` frontmatter:** Colors, typography, spacing, radius. Never hardcode.
4. **Reuse `mobile/ui/` primitives:** Check for existing components before implementing new ones.
5. **Use Tamagui:** Implement the UI through Tamagui tokens, styled components, and variants.
6. **Prefer shared cross-platform output:** Do not split by platform only because the Figma frame looks iOS-like.
7. **Validate:** Confirm token usage, touch targets ≥44px, outdoor readability, French copy, and MVP scope.

## Asset policy

- This repository currently has no real brand assets, illustrations, or icon packs checked in.
- Use tasteful placeholders when needed.
- Mark placeholders clearly in mockups, specs, or generated screens.
- Prefer rounded line icons in a Lucide-like style with 2 px stroke.

## Output guidance

- For production code, emit token-driven Tamagui UI that maps directly to `DESIGN.md`.
- When implementing from Figma frames, cite the frame URL and use Figma MCP to extract tokens.
- For prototypes or mockups, prefer static HTML/CSS artifacts or simple screen specs that still follow the same tokens.
- For design critique, evaluate Beach Glass fit, Tamagui consistency, cross-platform simplicity, outdoor readability, accessibility, and MVP scope discipline.
- When changing `DESIGN.md`, run `npx @google/design.md lint DESIGN.md` if available and fix warnings when feasible.
- After UI implementation, run the smallest useful checks first, then broaden if shared packages were touched.

## Quality bar

Every output should feel:

- bright
- coastal
- premium
- lightweight
- spontaneous
- readable outdoors
- coherent on both iOS and Android
- simple to maintain in Tamagui

Reject outputs that feel:

- dark dashboard
- generic template
- neon
- over-glassed
- native-effect driven
- platform-fragmented
- enterprise
- social-feed heavy
