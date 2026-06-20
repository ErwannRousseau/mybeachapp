import { describe, expect, it } from "vitest";
import { findByText, renderWithTamagui } from "../../test/render-with-tamagui";

import { Button } from "../button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "../empty";

describe("Empty", () => {
  it("supports the approved composable empty-state structure", async () => {
    const root = await renderWithTamagui(
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Aucune activité</EmptyTitle>
          <EmptyDescription>Essaie une autre plage.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>Créer une activité</Button>
        </EmptyContent>
      </Empty>,
    );

    expect(findByText(root, "Aucune activité")).toBeTruthy();
    expect(findByText(root, "Créer une activité")).toBeTruthy();
  });
});
