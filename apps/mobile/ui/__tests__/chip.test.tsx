import { describe, expect, it } from "vitest";

import { findByText, renderWithTamagui } from "../../test/render-with-tamagui";
import { Chip } from "../chip";

describe("Chip", () => {
  it("renders a selectable pill label", async () => {
    const root = await renderWithTamagui(
      <Chip selected>Sports de ballon</Chip>,
    );

    expect(findByText(root, "Sports de ballon")).toBeTruthy();
  });
});
