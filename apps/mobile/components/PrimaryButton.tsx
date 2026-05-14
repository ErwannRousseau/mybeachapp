import type { Ref } from "react";
import { Pressable, type PressableProps, Text, type View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type PrimaryButtonProps = {
  label: string;
  ref?: Ref<View>;
  variant?: "primary" | "secondary";
} & PressableProps;

export function PrimaryButton({
  label,
  ref,
  variant = "primary",
  ...pressableProps
}: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      ref={ref}
      {...pressableProps}
      style={(state) => [
        styles.button(variant, state.pressed),
        typeof pressableProps.style === "function"
          ? pressableProps.style(state)
          : pressableProps.style,
      ]}
    >
      <Text style={styles.label(variant)}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: (variant: "primary" | "secondary", pressed: boolean) => ({
    alignItems: "center",
    backgroundColor:
      variant === "primary" ? theme.colors.primary : theme.colors.secondarySoft,
    borderRadius: theme.radii.full,
    justifyContent: "center",
    minHeight: 54,
    opacity: pressed ? 0.82 : 1,
    paddingHorizontal: theme.spacing.lg,
  }),
  label: (variant: "primary" | "secondary") => ({
    ...theme.typography.bodyStrong,
    color:
      variant === "primary" ? theme.colors.onPrimary : theme.colors.onSurface,
    textAlign: "center",
  }),
}));
