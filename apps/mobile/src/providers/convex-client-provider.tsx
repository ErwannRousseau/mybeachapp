import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { PropsWithChildren } from "react";

import { env } from "@/src/config/env";

const convexClient = new ConvexReactClient(env.convexUrl);

export function ConvexClientProvider({ children }: PropsWithChildren) {
  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
}
