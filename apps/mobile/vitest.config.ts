import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^react-native$/,
        replacement: "react-native-web",
      },
      {
        find: /^@\//,
        replacement: `${fileURLToPath(new URL("./", import.meta.url))}/`,
      },
      {
        find: /^@tamagui\/lucide-icons-2$/,
        replacement: fileURLToPath(
          new URL("./test/mocks/lucide-icons-2.tsx", import.meta.url),
        ),
      },
    ],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
  },
});
