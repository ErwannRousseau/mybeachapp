import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import * as SecureStore from "expo-secure-store";
import type { PropsWithChildren } from "react";

import { env } from "@/src/config/env";

const convexClient = new ConvexReactClient(env.convexUrl);

const authStorage = {
  getItem: SecureStore.getItemAsync,
  removeItem: SecureStore.deleteItemAsync,
  setItem: SecureStore.setItemAsync,
};

export function ConvexClientProvider({ children }: PropsWithChildren) {
  return (
    <ConvexAuthProvider
      client={convexClient}
      storage={authStorage}
      storageNamespace="mybeachapp"
    >
      {children}
    </ConvexAuthProvider>
  );
}
