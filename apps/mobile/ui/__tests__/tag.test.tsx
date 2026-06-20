import { describe, expect, it } from "vitest";

import { findByText, renderWithTamagui } from "../../test/render-with-tamagui";
import { Tag } from "../tag";

describe("Tag", () => {
  it("renders warning content as a non-interactive pill", async () => {
    const root = await renderWithTamagui(
      <Tag variant="warning">Presque complet</Tag>,
    );

    expect(findByText(root, "Presque complet")).toBeTruthy();
  });
});
