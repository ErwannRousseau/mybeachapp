import { describe, expect, it } from "vitest";

import { findByText, renderWithTamagui } from "../../test/render-with-tamagui";
import { Avatar, AvatarFallback } from "../avatar";

describe("Avatar", () => {
  it("composes fallback content", async () => {
    const root = await renderWithTamagui(
      <Avatar>
        <AvatarFallback>ER</AvatarFallback>
      </Avatar>,
    );

    expect(findByText(root, "ER")).toBeTruthy();
  });
});
