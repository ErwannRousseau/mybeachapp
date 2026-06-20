import { describe, expect, test } from "vitest";

import config from "../base.json";

describe("typescript config package", () => {
  test("exports the shared TypeScript base config", () => {
    expect(config.$schema).toBe("https://json.schemastore.org/tsconfig");
  });
});
