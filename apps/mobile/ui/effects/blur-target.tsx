import { BlurTargetView as ExpoBlurTargetView } from "expo-blur";
import React from "react";
import { StyleSheet, type View } from "react-native";

import { BlurTargetContext } from "./blur-target-context";

export type BlurTargetProps = {
  children: React.ReactNode;
};

export function BlurTargetProvider({ children }: BlurTargetProps) {
  const targetRef = React.useRef<View | null>(null);

  return (
    <BlurTargetContext.Provider value={targetRef}>
      {children}
    </BlurTargetContext.Provider>
  );
}

export function BlurTargetContent({ children }: BlurTargetProps) {
  const targetRef = React.use(BlurTargetContext);

  return (
    <ExpoBlurTargetView ref={targetRef} style={styles.target}>
      {children}
    </ExpoBlurTargetView>
  );
}

const styles = StyleSheet.create({
  target: {
    flex: 1,
  },
});
