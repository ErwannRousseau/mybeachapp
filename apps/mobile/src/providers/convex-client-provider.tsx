import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { PropsWithChildren } from "react";

import { getMobileEnv } from "@/src/config/env";

const convexClient = new ConvexReactClient(getMobileEnv().convexUrl);

export function ConvexClientProvider({ children }: PropsWithChildren) {
  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
}
