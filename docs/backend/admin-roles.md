# Admin roles

Admin access is enforced in Convex. Frontend checks only gate UI.

## Roles

| Role | Back-office access | Read activities | Manage Admin roles |
| --- | --- | --- | --- |
| `user` | No | No | No |
| `admin` | Yes | Yes | No |
| `super_admin` | Yes | Yes | Yes |

An Admin must first create an account through the mobile app and have an
active Beach Profile. A Super Admin promotes that existing Signed-in User by
exact email. Revoking the role returns the profile to `user`.

The back-office root guard checks the session and `api.admin.viewer` before it
renders a route. Grant and revoke mutations separately enforce
`adminRole.grant` and `adminRole.revoke`. Disabled profiles fail closed.

## First super admin

1. Sign in once with `erwann.rousseau@icloud.com` so a Beach Profile exists.
2. Run `cd packages/backend && bun run seed:super-admin`.

Set `INITIAL_SUPER_ADMIN_EMAILS` as a comma-separated deployment variable to replace or add bootstrap emails. The seed upgrades one active matching profile to `super_admin`; it fails if the caller identity email is not allowlisted, the email has no profile, or more than one profile matches.

## Web authentication configuration

`ADMIN_SITE_URL` is the allowed back-office origin used by Better Auth and
credentialed CORS. Set it independently for each Convex deployment:

```bash
cd packages/backend
bunx convex env set ADMIN_SITE_URL http://localhost:3000
```

The back-office consumes `VITE_CONVEX_URL` and `VITE_CONVEX_SITE_URL`; see
[`apps/admin/.env.example`](../../apps/admin/.env.example).

The permission model and its resource-action decision are recorded in
[`docs/adr/0004-admin-role-bootstrap.md`](../adr/0004-admin-role-bootstrap.md).
