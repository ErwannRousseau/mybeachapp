import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { PropsWithChildren } from "react";

import { mobileEnv } from "@/src/config/env";

const convexClient = mobileEnv.convexUrl
  ? new ConvexReactClient(mobileEnv.convexUrl)
  : null;

export function ConvexClientProvider({ children }: PropsWithChildren) {
  if (!convexClient) {
    return <>{children}</>;
  }

  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
}
