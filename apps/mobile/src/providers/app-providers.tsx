import { LocaleProvider } from "@/src/localization/provider";

import { ConvexClientProvider } from "./convex-client-provider";

export function AppProviders({ children }: React.PropsWithChildren) {
  return (
    <LocaleProvider>
      <ConvexClientProvider>{children}</ConvexClientProvider>
    </LocaleProvider>
  );
}
