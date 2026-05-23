import type { PropsWithChildren } from "react";

import { ConvexClientProvider } from "./convex-client-provider";

export function AppProviders({ children }: PropsWithChildren) {
  return <ConvexClientProvider>{children}</ConvexClientProvider>;
}
