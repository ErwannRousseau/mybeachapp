import { act } from "react";
import { TamaguiProvider } from "tamagui";
import { createRoot, type Root, type TestInstance } from "test-renderer";

import tamaguiConfig from "../tamagui.config";

export async function renderWithTamagui(component: React.ReactElement) {
  const root = createRoot();

  await act(async () => {
    root.render(
      <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
        {component}
      </TamaguiProvider>,
    );
  });

  return root;
}

export function findByText(root: Root, text: string) {
  const match = root.container.queryAll(
    (node) => node.children.includes(text),
    { matchDeepestOnly: true },
  )[0];

  if (!match) {
    throw new Error(`Unable to find text: ${text}`);
  }

  return match;
}

export function queryByText(root: Root, text: string) {
  return root.container.queryAll((node) => node.children.includes(text), {
    matchDeepestOnly: true,
  })[0];
}

export function findByType(root: Root, type: string) {
  const match = root.container.queryAll((node) => node.type === type)[0];

  if (!match) {
    throw new Error(`Unable to find host type: ${type}`);
  }

  return match;
}

export function findByProp(root: Root, prop: string) {
  const match = root.container.queryAll(
    (node) => typeof node.props[prop] !== "undefined",
  )[0];

  if (!match) {
    throw new Error(`Unable to find prop: ${prop}`);
  }

  return match;
}

export function getClassToken(node: TestInstance, prefix: string) {
  const className = String(node.props.className ?? "");
  const token = className.split(" ").find((value) => value.startsWith(prefix));

  if (!token) {
    throw new Error(`Unable to find class token with prefix: ${prefix}`);
  }

  return token;
}
