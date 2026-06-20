import { describe, expect, it } from "vitest";

import { findByProp, renderWithTamagui } from "../../test/render-with-tamagui";
import { SearchBar } from "../search-bar";

function handleSearch() {
  return undefined;
}

describe("SearchBar", () => {
  it("renders a search input with the submitted-search API available", async () => {
    const root = await renderWithTamagui(
      <SearchBar onSearch={handleSearch} placeholder="Chercher une plage" />,
    );

    expect(findByProp(root, "placeholder").props.placeholder).toBe(
      "Chercher une plage",
    );
  });
});
