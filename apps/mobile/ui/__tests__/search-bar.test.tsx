import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import {
  findByProp,
  findByType,
  renderWithTamagui,
} from "../../test/render-with-tamagui";
import { SearchBar } from "../search-bar";

vi.mock("@/ui/surface", () => ({
  FloatingSurface: ({ children, ...props }: React.PropsWithChildren) =>
    createElement("FloatingSurface", props, children),
}));

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
    expect(findByType(root, "FloatingSurface")).toBeDefined();
  });
});
