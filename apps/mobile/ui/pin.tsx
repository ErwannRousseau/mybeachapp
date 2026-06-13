import { type GetProps, styled, XStack } from "tamagui";

import { Text } from "./typography";

export type PinVariant = "default" | "open" | "warning";

const PinFrame = styled(XStack, {
  bg: "$surface",
  borderColor: "$border",
  borderWidth: 1,
  height: 44,
  items: "center",
  justify: "center",
  name: "BeachPin",
  rounded: "$full",
  variants: {
    variant: {
      default: {
        bg: "$surface",
      },
      open: {
        bg: "$success",
      },
      warning: {
        bg: "$warning",
      },
    },
  } as const,
  width: 44,
});

export type PinProps = GetProps<typeof PinFrame> & {
  children?: React.ReactNode;
  variant?: PinVariant;
};

export function Pin({ children, variant = "default", ...props }: PinProps) {
  return (
    <PinFrame variant={variant} {...props}>
      <Text
        size="sm"
        variant={variant === "default" ? "accent" : "default"}
        weight="semibold"
      >
        {children}
      </Text>
    </PinFrame>
  );
}
