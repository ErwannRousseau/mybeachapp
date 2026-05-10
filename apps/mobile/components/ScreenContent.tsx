import type React from "react";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { EditScreenInfo } from "./EditScreenInfo";

type ScreenContentProps = {
  title: string;
  path: string;
  children?: React.ReactNode;
};

export const ScreenContent = ({
  title,
  path,
  children,
}: ScreenContentProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.separator} />
      <EditScreenInfo path={path} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: "center",
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  separator: {
    backgroundColor: theme.colors.limedSpruce,
    height: 1,
    marginVertical: 30,
    width: "80%",
  },
  title: {
    color: theme.colors.typography,
    fontSize: 20,
    fontWeight: "bold",
  },
}));
