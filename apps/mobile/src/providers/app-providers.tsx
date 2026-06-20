import { ConvexClientProvider } from "./convex-client-provider";

export function AppProviders({ children }: React.PropsWithChildren) {
  return <ConvexClientProvider>{children}</ConvexClientProvider>;
}
