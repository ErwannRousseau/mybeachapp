import { describe, expect, it } from "vitest";

import {
  findByText,
  renderWithTamagui,
} from "../../../../../test/render-with-tamagui";
import { ActivityCard } from "../activity-card";

describe("ActivityCard", () => {
  it("renders activity summary details from the feature layer", async () => {
    const root = await renderWithTamagui(
      <ActivityCard
        category="Sports de ballon"
        distance="500 m"
        participants="4 / 8"
        status="open"
        time="Aujourd’hui 18:00"
        title="Beach-volley à Bonne-Source"
      />,
    );

    expect(findByText(root, "Beach-volley à Bonne-Source")).toBeTruthy();
    expect(findByText(root, "Ouvert")).toBeTruthy();
  });
});
