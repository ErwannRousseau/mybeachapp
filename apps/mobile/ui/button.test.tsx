import * as Haptics from "expo-haptics";
import { describe, expect, it, vi } from "vitest";

import {
  findByProp,
  findByText,
  renderWithTamagui,
} from "../test/render-with-tamagui";
import { Button } from "./button";

function renderIcon() {
  return null;
}

describe("Button", () => {
  it("renders string children through button text", async () => {
    const root = await renderWithTamagui(<Button>Créer une activité</Button>);

    expect(findByText(root, "Créer une activité")).toBeTruthy();
  });

  it("supports the common icon prop API", async () => {
    const root = await renderWithTamagui(
      <Button icon={renderIcon}>Créer</Button>,
    );

    expect(findByText(root, "Créer")).toBeTruthy();
  });

  it("accepts glass tint and disabled glint composition", async () => {
    const root = await renderWithTamagui(
      <Button disableGlint glass glassTint="#eaf8fc" glint>
        Voir la carte
      </Button>,
    );

    expect(findByText(root, "Voir la carte")).toBeTruthy();
  });

  it("delays the press handler when delayPress is enabled", async () => {
    vi.useFakeTimers();
    const onPress = vi.fn();
    const root = await renderWithTamagui(
      <Button delayPress onPress={onPress}>
        Rechercher
      </Button>,
    );

    findByProp(root, "onClick").props.onClick({
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    });

    expect(onPress).not.toHaveBeenCalled();
    vi.advanceTimersByTime(20);
    expect(onPress).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("triggers selection haptics on press-in when requested", async () => {
    const root = await renderWithTamagui(
      <Button haptic="selection">Je participe</Button>,
    );

    findByProp(root, "onMouseDown").props.onMouseDown({
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    });

    expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
  });
});
