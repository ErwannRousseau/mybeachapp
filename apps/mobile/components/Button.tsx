import type { Ref } from "react";
import {
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
  type View,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

type ButtonProps = {
  ref?: Ref<View>;
  title?: string;
} & TouchableOpacityProps;

export function Button({ ref, title, ...touchableProps }: ButtonProps) {
  return (
    <TouchableOpacity
      ref={ref}
      {...touchableProps}
      style={[styles.button, touchableProps.style]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: {
    alignItems: "center",
    backgroundColor: theme.colors.cornflowerBlue,
    borderRadius: 24,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
}));
