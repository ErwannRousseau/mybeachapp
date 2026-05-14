# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Layout

This repo uses multi-context domain docs.

- Read **`CONTEXT-MAP.md`** at the repo root first. It points at one `CONTEXT.md` per context.
- Read the context-specific `CONTEXT.md` files relevant to the topic.
- Read **`docs/adr/`** for system-wide decisions when it exists.
- Read **`src/<context>/docs/adr/`** or equivalent context-local ADR directories when they exist.

If any of these files don't exist, proceed silently. Don't flag their absence; don't suggest creating them upfront. The producer skill (`/grill-with-docs`) creates them lazily when terms or decisions actually get resolved.

## Multi-context structure

```text
/
├── CONTEXT-MAP.md
├── docs/adr/
└── src/
    ├── ordering/
    │   ├── CONTEXT.md
    │   └── docs/adr/
    └── billing/
        ├── CONTEXT.md
        └── docs/adr/
```

Actual context names may differ. Follow `CONTEXT-MAP.md` over this example.

## Use glossary vocabulary

When output names a domain concept in an issue title, refactor proposal, hypothesis, or test name, use the term as defined in the relevant `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, either reconsider the wording or note the gap for `/grill-with-docs`.

## Flag ADR conflicts

If output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> Contradicts ADR-0007 (event-sourced orders), but worth reopening because...
