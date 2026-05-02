---
name: my-beach-app-design
description: Design, prototype, implement, or review My Beach App interfaces using the Beach Glass design system in DESIGN.md. Use when Codex works on My Beach App mobile screens, map-first UX, iOS Liquid Glass surfaces, Android Material adaptations, design tokens, UI copy, HTML mockups, React Native UI, or design QA for see/create/join beach activity flows.
---

# My Beach App Design

## Read order

1. Read `DESIGN.md` first.
2. Read the YAML frontmatter before prose; it is the canonical token source.
3. Treat `DESIGN.md` as the only local source of truth for brand, tokens, and component rules.

## Default workflow

1. Extract the target screen or artifact from the user request.
2. Anchor every proposal in the Beach Glass system from `DESIGN.md`.
3. Keep the output map-first, mobile-first, and centered on `see / create / join`.
4. Use French for customer-facing MVP copy.
5. Reuse semantic tokens and component patterns instead of inventing new UI language.
6. Validate against the `Do's and Don'ts` section in `DESIGN.md` before finalizing.

## Hard rules

- Coral `#FF6B4A` is for the main CTA only.
- Use one dominant Coral action per screen.
- No emoji in product UI.
- No decorative Unicode symbols.
- iOS glass only on approved floating surfaces and only via a wrapper such as `GlassSurface`.
- Android must not mimic iOS glass.
- Bottom navigation can be Liquid Glass on iOS and Material-style on Android, following `DESIGN.md`.
- Minimum body text: 16 px.
- Minimum touch target: 44 px.
- Cards and search bars use 24 px radius.
- Bottom sheets use 32 px radius.
- Inputs use visible labels and clear borders.
- Do not add chat, payments, groups, reputation, or feed features unless explicitly requested.

## Asset policy

- This repository currently has no real brand assets, illustrations, or icon packs checked in.
- Use tasteful placeholders when needed.
- Mark placeholders clearly in mockups, specs, or generated screens.
- Prefer rounded line icons in a Lucide-like style with 2 px stroke.

## Output guidance

- For production code, emit token-driven UI that maps directly to `DESIGN.md`.
- For prototypes or mockups, prefer static HTML/CSS artifacts or simple screen specs that still follow the same tokens.
- For design critique, evaluate Beach Glass fit, platform nativeness, outdoor readability, accessibility, and MVP scope discipline.
- When changing `DESIGN.md`, run `npx @google/design.md lint DESIGN.md` and fix warnings when feasible.

## Quality bar

Every output should feel:
- bright
- coastal
- premium
- lightweight
- spontaneous
- readable outdoors
- native by platform

Reject outputs that feel:
- dark dashboard
- generic template
- neon
- over-glassed
- enterprise
- social-feed heavy
