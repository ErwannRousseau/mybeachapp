import { describe, expect, test } from "vitest";

import type { CreateActivityInput } from "../types";
import {
  isActivityCategory,
  isActivityStatus,
  isValidLatitude,
  isValidLongitude,
  isValidMaxParticipants,
  validateCreateActivityInput,
} from "../validators";

describe("activity validators", () => {
  test("activity category guard", () => {
    expect(isActivityCategory("ball_sport")).toBe(true);
    expect(isActivityCategory("chess")).toBe(false);
  });

  test("activity status guard", () => {
    expect(isActivityStatus("open")).toBe(true);
    expect(isActivityStatus("draft")).toBe(false);
  });

  test("latitude bounds", () => {
    expect(isValidLatitude(45)).toBe(true);
    expect(isValidLatitude(95)).toBe(false);
  });

  test("longitude bounds", () => {
    expect(isValidLongitude(-2.4)).toBe(true);
    expect(isValidLongitude(200)).toBe(false);
  });

  test("max participants bounds", () => {
    expect(isValidMaxParticipants(6)).toBe(true);
    expect(isValidMaxParticipants(1)).toBe(false);
    expect(isValidMaxParticipants(50)).toBe(false);
    expect(isValidMaxParticipants(2.5)).toBe(false);
  });
});

describe("validateCreateActivityInput", () => {
  const valid: CreateActivityInput = {
    category: "ball_sport",
    location: {
      addressLabel: "Plage de Pornichet",
      latitude: 47.2667,
      longitude: -2.3333,
    },
    maxParticipants: 6,
    startDateTime: Date.now() + 3_600_000,
    title: "Beach volley sunset",
  };

  test("accepts valid input", () => {
    expect(validateCreateActivityInput(valid)).toEqual([]);
  });

  test("collects multiple errors", () => {
    const errors = validateCreateActivityInput({
      ...valid,
      category: "chess" as never,
      location: { ...valid.location, latitude: 999 },
      maxParticipants: 0,
      title: "",
    });
    const fields = errors.map((e) => e.field);
    expect(fields).toContain("title");
    expect(fields).toContain("category");
    expect(fields).toContain("maxParticipants");
    expect(fields).toContain("location.latitude");
    expect(errors).toContainEqual({
      field: "category",
      message: "category_invalid",
    });
  });
});
