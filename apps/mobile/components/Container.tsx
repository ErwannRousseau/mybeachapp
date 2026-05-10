import type React from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export const Container = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    paddingBottom: rt.insets.bottom,
  },
}));
