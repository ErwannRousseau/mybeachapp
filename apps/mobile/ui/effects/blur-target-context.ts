import React from "react";
import type { View } from "react-native";

export const BlurTargetContext = React.createContext<
  React.RefObject<View | null> | undefined
>(undefined);

export function useBlurTarget() {
  return React.use(BlurTargetContext);
}
