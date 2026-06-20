import { describe, expect, test } from "vitest";

import { isParticipationStatus } from "../validators";

describe("participation validators", () => {
  test("participation status guard", () => {
    expect(isParticipationStatus("joined")).toBe(true);
    expect(isParticipationStatus("pending")).toBe(false);
  });
});
