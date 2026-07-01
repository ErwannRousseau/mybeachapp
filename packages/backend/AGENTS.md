<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

## Package Commands

- `bun run dev` runs `convex dev`.
- `bun run build` and `bun run typecheck` both run `convex codegen --dry-run --typecheck enable`.
- `bun run check` and `bun run test` are the local verification scripts.
- Keep `packages/backend/convex/_generated` untouched unless you are running codegen.

<!-- convex-ai-end -->
