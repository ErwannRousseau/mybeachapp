import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { PropsWithChildren } from "react";

import { authClient } from "@/src/auth/auth-client";
import { env } from "@/src/config/env";

const convexClient = new ConvexReactClient(env.convexUrl, {
  unsavedChangesWarning: false,
});

export function ConvexClientProvider({ children }: PropsWithChildren) {
  return (
    <ConvexProvider client={convexClient}>
      <ConvexBetterAuthProvider authClient={authClient} client={convexClient}>
        {children}
      </ConvexBetterAuthProvider>
    </ConvexProvider>
  );
}
