import * as Haptics from "expo-haptics";
import React from "react";
import {
  createStyledContext,
  type GetProps,
  SizableText,
  styled,
  Button as TamaguiButton,
  View,
  XStack,
} from "tamagui";

export type ButtonHaptic = boolean | "heavy" | "light" | "medium" | "selection";
export type ButtonSize = "icon" | "md" | "sm";
export type ButtonVariant =
  | "destructive"
  | "ghost"
  | "primary"
  | "secondary"
  | "text";

type ButtonIconComponent = React.ComponentType<{
  color?: string;
  size?: number;
  strokeWidth?: number;
}>;

const buttonContext = createStyledContext({
  buttonSize: "md" as ButtonSize,
  buttonVariant: "primary" as ButtonVariant,
  glass: false,
});

const useButtonContext = buttonContext.useStyledContext;

const ButtonFrame = styled(TamaguiButton, {
  bg: "$primary",
  borderColor: "$transparent",
  borderWidth: 0,
  context: buttonContext,
  gap: "$xs",
  items: "center",
  justify: "center",
  minH: "$button",
  name: "BeachButton",
  overflow: "hidden",
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
        minW: "$touchPreferred",
        px: 0,
        width: "$touchPreferred",
      },
      md: {
        minH: "$button",
        px: "$lg",
      },
      sm: {
        minH: "$touchMin",
        px: "$md",
      },
    },
    buttonVariant: {
      destructive: {
        bg: "$destructive",
      },
      ghost: {
        bg: "$transparent",
      },
      primary: {
        bg: "$primary",
      },
      secondary: {
        bg: "$secondary",
      },
      text: {
        bg: "$transparent",
        minH: "$touchMin",
        px: "$xs",
      },
    },
    disabled: {
      true: {
        opacity: 0.45,
        pointerEvents: "none",
      },
    },
    fullWidth: {
      false: {
        self: "flex-start",
      },
      true: {
        self: "stretch",
      },
    },
    glass: {
      true: {
        bg: "$floatingSurface",
        borderColor: "$border",
        borderWidth: 1,
      },
    },
  } as const,
});

const ButtonTextFrame = styled(SizableText, {
  color: "$primaryForeground",
  context: buttonContext,
  fontFamily: "$body",
  fontWeight: "600",
  letterSpacing: 0,
  name: "BeachButtonText",
  numberOfLines: 1,
  select: "none",
  size: "$bodyMd",
  text: "center",
  variants: {
    buttonSize: {
      icon: {
        size: "$headlineMd",
      },
      md: {
        size: "$bodyMd",
      },
      sm: {
        size: "$labelMd",
      },
    },
    buttonVariant: {
      destructive: {
        color: "$destructiveForeground",
      },
      ghost: {
        color: "$foreground",
      },
      primary: {
        color: "$primaryForeground",
      },
      secondary: {
        color: "$secondaryForeground",
      },
      text: {
        color: "$foreground",
      },
    },
    glass: {
      true: {
        color: "$floatingSurfaceForeground",
      },
    },
  } as const,
});

const ButtonIconFrame = styled(XStack, {
  context: buttonContext,
  items: "center",
  justify: "center",
  name: "BeachButtonIcon",
});

const ButtonTint = styled(View, {
  b: 0,
  bg: "$surface",
  l: 0,
  opacity: 0.16,
  pointerEvents: "none",
  position: "absolute",
  r: 0,
  t: 0,
});

const ButtonGlint = styled(View, {
  b: 0,
  borderColor: "$transparent",
  borderTopColor: "$surface",
  borderTopWidth: 1,
  l: 0,
  opacity: 0.7,
  pointerEvents: "none",
  position: "absolute",
  r: 0,
  t: 0,
});

export type ButtonTextProps = GetProps<typeof ButtonTextFrame> & {
  children?: React.ReactNode;
};

export function ButtonText({ children, ...props }: ButtonTextProps) {
  return <ButtonTextFrame {...props}>{children}</ButtonTextFrame>;
}

export type ButtonIconProps = GetProps<typeof ButtonIconFrame> & {
  children?: React.ReactNode;
  icon?: ButtonIconComponent;
  scale?: number;
  strokeWidth?: number;
};

export function ButtonIcon({
  children,
  icon: Icon,
  scale = 1,
  strokeWidth = 2.25,
  ...props
}: ButtonIconProps) {
  const context = useButtonContext();
  const iconSize = getButtonIconSize(context.buttonSize, scale);
  const iconColor = getButtonContentColor(context.buttonVariant, context.glass);

  return (
    <ButtonIconFrame {...props}>
      {Icon ? (
        <Icon color={iconColor} size={iconSize} strokeWidth={strokeWidth} />
      ) : (
        children
      )}
    </ButtonIconFrame>
  );
}

export type ButtonProps = Omit<
  GetProps<typeof ButtonFrame>,
  | "buttonSize"
  | "buttonVariant"
  | "children"
  | "fullWidth"
  | "glass"
  | "icon"
  | "size"
  | "variant"
> & {
  children?: React.ReactNode;
  fullWidth?: boolean;
  glass?: boolean;
  glint?: boolean;
  haptic?: ButtonHaptic;
  icon?: ButtonIconComponent;
  iconAfter?: ButtonIconComponent;
  size?: ButtonSize;
  tint?: boolean;
  variant?: ButtonVariant;
};

export function Button({
  children,
  disabled,
  fullWidth,
  glass = false,
  glint = false,
  haptic = false,
  icon,
  iconAfter,
  onPressIn,
  size = "md",
  tint = false,
  variant = "primary",
  ...props
}: ButtonProps) {
  const resolvedFullWidth = fullWidth ?? size !== "icon";
  const handlePressIn = React.useCallback(
    (event: Parameters<NonNullable<ButtonProps["onPressIn"]>>[0]) => {
      if (!disabled) {
        triggerButtonHaptic(haptic);
      }
      onPressIn?.(event);
    },
    [disabled, haptic, onPressIn],
  );

  return (
    <ButtonFrame
      {...props}
      buttonSize={size}
      buttonVariant={variant}
      disabled={disabled}
      fullWidth={resolvedFullWidth}
      glass={glass}
      onPressIn={handlePressIn}
    >
      {tint ? <ButtonTint /> : null}
      {glint ? <ButtonGlint /> : null}
      {icon ? <ButtonIcon icon={icon} /> : null}
      {renderButtonChildren(children)}
      {iconAfter ? <ButtonIcon icon={iconAfter} /> : null}
    </ButtonFrame>
  );
}

export namespace Button {
  export const Icon = ButtonIcon;
  export const Text = ButtonText;
}

function renderButtonChildren(children: React.ReactNode) {
  return React.Children.map(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return <ButtonText>{child}</ButtonText>;
    }

    return child;
  });
}

function getButtonIconSize(size: ButtonSize, scale: number) {
  const baseSize = size === "icon" ? 22 : size === "sm" ? 16 : 18;

  return baseSize * scale;
}

function getButtonContentColor(variant: ButtonVariant, glass?: boolean) {
  if (glass) {
    return "$floatingSurfaceForeground";
  }

  switch (variant) {
    case "destructive":
      return "$destructiveForeground";
    case "ghost":
    case "text":
      return "$foreground";
    case "secondary":
      return "$secondaryForeground";
    case "primary":
      return "$primaryForeground";
  }
}

function triggerButtonHaptic(haptic: ButtonHaptic) {
  if (!haptic) {
    return;
  }

  if (haptic === "selection") {
    void Haptics.selectionAsync();
    return;
  }

  const style =
    haptic === "heavy"
      ? Haptics.ImpactFeedbackStyle.Heavy
      : haptic === "medium"
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Light;

  void Haptics.impactAsync(style);
}
