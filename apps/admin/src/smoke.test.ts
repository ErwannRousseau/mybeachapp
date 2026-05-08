import { describe, expect, test } from "bun:test";

import { ACTIVITY_CATEGORIES } from "@mybeachapp/shared";

describe("admin workspace", () => {
  test("can read shared activity categories", () => {
    expect(ACTIVITY_CATEGORIES).toContain("beach_volley");
  });
});
