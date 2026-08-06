import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";

import { authClient } from "#/auth/auth-client";
import { env } from "#/config/env";

const convexClient = new ConvexReactClient(env.convexUrl, { expectAuth: true });

export function AuthProvider({ children }: React.PropsWithChildren) {
  return (
    <ConvexBetterAuthProvider authClient={authClient} client={convexClient}>
      {children}
    </ConvexBetterAuthProvider>
  );
}
