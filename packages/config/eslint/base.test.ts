import { describe, expect, test } from "bun:test";

import config from "./base.mjs";

describe("eslint config package", () => {
  test("exports a reusable config array", () => {
    expect(Array.isArray(config)).toBe(true);
  });
});
