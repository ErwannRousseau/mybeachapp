import { type GetProps, styled, Button as TamaguiButton } from "tamagui";

export type ButtonSize = "icon" | "md" | "sm";
export type ButtonVariant = "destructive" | "ghost" | "primary" | "secondary";

const ButtonFrame = styled(TamaguiButton, {
  bg: "$primary",
  borderColor: "$transparent",
  borderWidth: 0,
  color: "$primaryForeground",
  fontSize: 16,
  fontWeight: "600",
  items: "center",
  justify: "center",
  minH: 54,
  name: "BeachButton",
  pressStyle: {
    opacity: 0.82,
  },
  px: "$lg",
  rounded: "$full",
  self: "stretch",
  unstyled: true,
  variants: {
    buttonSize: {
      icon: {
        height: "$touchPreferred",
        minH: "$touchPreferred",
        px: 0,
        width: "$touchPreferred",
      },
      md: {
        minH: 54,
        px: "$lg",
      },
      sm: {
        minH: "$touchMin",
        px: "$md",
      },
    },
    variant: {
      destructive: {
        bg: "$destructive",
        color: "$destructiveForeground",
      },
      ghost: {
        bg: "$transparent",
        color: "$accent",
      },
      primary: {
        bg: "$primary",
        color: "$primaryForeground",
      },
      secondary: {
        bg: "$secondary",
        color: "$secondaryForeground",
      },
    },
  } as const,
});

export type ButtonProps = Omit<
  GetProps<typeof ButtonFrame>,
  "buttonSize" | "size"
> & {
  children: React.ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export function Button({
  children,
  size = "md",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <ButtonFrame buttonSize={size} variant={variant} {...props}>
      {children}
    </ButtonFrame>
  );
}
