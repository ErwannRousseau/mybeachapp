import { describe, expect, it } from "vitest";

import {
  findByText,
  getClassToken,
  renderWithTamagui,
} from "../../test/render-with-tamagui";
import { Headline, Title } from "../typography";

describe("Headline", () => {
  it("maps the medium size to the headline-md token", async () => {
    const root = await renderWithTamagui(
      <>
        <Headline size="md">Titre moyen</Headline>
        <Headline size="lg">Grand titre</Headline>
        <Title size="md">Titre de référence</Title>
      </>,
    );
    const mediumHeadlineSize = getClassToken(
      findByText(root, "Titre moyen"),
      "_fs-",
    );
    const largeHeadlineSize = getClassToken(
      findByText(root, "Grand titre"),
      "_fs-",
    );
    const mediumTitleSize = getClassToken(
      findByText(root, "Titre de référence"),
      "_fs-",
    );

    expect(mediumHeadlineSize).toBe(mediumTitleSize);
    expect(mediumHeadlineSize).not.toBe(largeHeadlineSize);
  });
});
