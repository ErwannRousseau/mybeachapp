import baseConfig from "@mybeachapp/config/vitest/base";
import { mergeConfig } from "vitest/config";

export default mergeConfig(baseConfig, {
  test: {
    testTimeout: 15_000,
  },
});
