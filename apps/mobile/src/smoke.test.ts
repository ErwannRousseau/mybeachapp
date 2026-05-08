import { describe, expect, test } from "bun:test";

import { ACTIVITY_STATUSES } from "@mybeach/shared";

describe("mobile workspace", () => {
  test("can read shared activity statuses", () => {
    expect(ACTIVITY_STATUSES).toContain("open");
  });
});
