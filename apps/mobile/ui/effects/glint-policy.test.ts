import { describe, expect, it } from "vitest";

import { shouldShowButtonGlint } from "./glint-policy";

const baseOptions = {
  disabled: false,
  disableGlint: false,
  glass: false,
  glint: true,
  platform: "android",
  size: "md",
  variant: "primary",
} as const;

describe("shouldShowButtonGlint", () => {
  it("shows glint for Android filled buttons", () => {
    expect(shouldShowButtonGlint(baseOptions)).toBe(true);
  });

  it("keeps glint disabled on iOS", () => {
    expect(
      shouldShowButtonGlint({
        ...baseOptions,
        platform: "ios",
      }),
    ).toBe(false);
  });

  it("allows Android glass buttons to keep the Takeout-style glint", () => {
    expect(
      shouldShowButtonGlint({
        ...baseOptions,
        glass: true,
      }),
    ).toBe(true);
  });

  it("hides glint for icon, ghost, text, disabled, and explicit opt-out", () => {
    expect(
      shouldShowButtonGlint({
        ...baseOptions,
        size: "icon",
      }),
    ).toBe(false);
    expect(
      shouldShowButtonGlint({
        ...baseOptions,
        variant: "ghost",
      }),
    ).toBe(false);
    expect(
      shouldShowButtonGlint({
        ...baseOptions,
        variant: "text",
      }),
    ).toBe(false);
    expect(
      shouldShowButtonGlint({
        ...baseOptions,
        disabled: true,
      }),
    ).toBe(false);
    expect(
      shouldShowButtonGlint({
        ...baseOptions,
        disableGlint: true,
      }),
    ).toBe(false);
  });
});
