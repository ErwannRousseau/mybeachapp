import baseVitestConfig from "@mybeachapp/config/vitest/base";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, mergeConfig } from "vitest/config";

export default mergeConfig(
  baseVitestConfig,
  defineConfig({
    plugins: [
      devtools(),
      tailwindcss(),
      tanstackRouter({ autoCodeSplitting: true, target: "react" }),
      viteReact(),
    ],
    resolve: { tsconfigPaths: true },
    test: {
      environment: "jsdom",
      passWithNoTests: true,
    },
  }),
);
