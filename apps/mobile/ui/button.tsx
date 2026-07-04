import type { IconProps } from "@tamagui/helpers-icon";
import React from "react";
import { Platform } from "react-native";
import {
  createStyledContext,
  type GetProps,
  SizableText,
  Spinner,
  styled,
  Button as TamaguiButton,
  XStack,
} from "tamagui";

import { GlassView } from "./effects/glass-view";
import { Glint } from "./effects/glint";
import { shouldShowButtonGlint } from "./effects/glint-policy";
import { type ButtonHaptic, triggerButtonHaptic } from "./haptics/haptics";

export type { ButtonHaptic } from "./haptics/haptics";

export type ButtonSize = "icon" | "md" | "sm";
export type ButtonVariant =
  | "destructive"
  | "ghost"
  | "primary"
  | "secondary"
  | "surface"
  | "text";

type ButtonIconComponent = React.ComponentType<IconProps>;

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
  flexDirection: "row",
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
      surface: {
        bg: "$surface",
        borderColor: "$border",
        borderWidth: 1,
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
        bg: "$transparent",
      },
    },
    loading: {
      true: {
        opacity: 1,
        pointerEvents: "none",
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
      surface: {
        color: "$foreground",
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
  delayPress?: boolean;
  disableGlint?: boolean;
  fullWidth?: boolean;
  glass?: boolean;
  glassTint?: string;
  glint?: boolean;
  haptic?: ButtonHaptic;
  icon?: ButtonIconComponent;
  iconAfter?: ButtonIconComponent;
  loading?: boolean;
  loadingLabel?: React.ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export function Button({
  children,
  delayPress = false,
  disabled,
  disableGlint = false,
  fullWidth,
  glass = false,
  glassTint,
  glint = true,
  haptic = false,
  icon,
  iconAfter,
  loading = false,
  loadingLabel,
  onPress,
  onPressIn,
  size = "md",
  variant = "primary",
  ...props
}: ButtonProps) {
  const resolvedFullWidth = fullWidth ?? size !== "icon";
  const isDisabled = Boolean(disabled || loading);
  const showGlint = shouldShowButtonGlint({
    disabled: isDisabled,
    disableGlint,
    glass,
    glint,
    platform: Platform.OS,
    size,
    variant,
  });
  const handlePress = React.useCallback(
    (event: Parameters<NonNullable<ButtonProps["onPress"]>>[0]) => {
      if (isDisabled) {
        return;
      }

      if (!onPress) {
        return;
      }

      if (delayPress) {
        setTimeout(() => onPress(event), 20);
        return;
      }

      onPress(event);
    },
    [delayPress, isDisabled, onPress],
  );
  const handlePressIn = React.useCallback(
    (event: Parameters<NonNullable<ButtonProps["onPressIn"]>>[0]) => {
      if (!isDisabled) {
        triggerButtonHaptic(haptic);
      }
      onPressIn?.(event);
    },
    [haptic, isDisabled, onPressIn],
  );
  const loadingColor = getButtonContentColor(variant, glass);
  const renderedChildren = loading && loadingLabel ? loadingLabel : children;

  const buttonElement = (
    <ButtonFrame
      {...props}
      buttonSize={size}
      buttonVariant={variant}
      disabled={isDisabled}
      fullWidth={resolvedFullWidth}
      glass={glass}
      loading={loading}
      onPress={onPress ? handlePress : undefined}
      onPressIn={handlePressIn}
    >
      {showGlint ? <Glint bottomShadow /> : null}
      {loading ? <Spinner color={loadingColor} size="small" /> : null}
      {!loading && icon ? <ButtonIcon icon={icon} /> : null}
      {renderButtonChildren(renderedChildren)}
      {!loading && iconAfter ? <ButtonIcon icon={iconAfter} /> : null}
    </ButtonFrame>
  );

  if (!glass) {
    return buttonElement;
  }

  return (
    <GlassView
      rounded="$full"
      self={resolvedFullWidth ? "stretch" : "flex-start"}
      tintColor={glassTint}
    >
      {buttonElement}
    </GlassView>
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
    case "surface":
      return "$foreground";
    case "primary":
      return "$primaryForeground";
  }
}
