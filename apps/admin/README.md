# My Beach App back-office

Vite and React back-office for My Beach App administrators.

## Access control

The root route checks the Better Auth session and calls `api.admin.viewer`
before rendering any back-office route. Convex is the enforcement source of
truth; frontend guards only control what the interface renders.

- `admin` can access the back-office and read activities.
- `super_admin` has the same access and can grant or revoke the `admin` role.
- Visitors, ordinary Signed-in Users, and disabled profiles cannot access the
  back-office.

See [`docs/backend/admin-roles.md`](../../docs/backend/admin-roles.md) for role
management and initial Super Admin setup.

## Local setup

Install dependencies from the repository root:

```bash
bun install
cp apps/admin/.env.example apps/admin/.env.local
```

Set the two public Convex URLs in `apps/admin/.env.local`:

```dotenv
VITE_CONVEX_URL=https://your-deployment.convex.cloud
VITE_CONVEX_SITE_URL=https://your-deployment.convex.site
```

Allow the local back-office origin in the Convex deployment:

```bash
cd packages/backend
bunx convex env set ADMIN_SITE_URL http://localhost:3000
```

Run Convex and the back-office from separate terminals:

```bash
bun run --cwd packages/backend dev
bun run --cwd apps/admin dev
```

The back-office is available at <http://localhost:3000>.

## Verification

```bash
bun run --cwd apps/admin check
bun run --cwd apps/admin typecheck
bun run --cwd apps/admin test
bun run --cwd apps/admin build
```
