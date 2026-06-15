import { type GetProps, styled, Text as TamaguiText, XStack } from "tamagui";

export type TagVariant =
  | "default"
  | "destructive"
  | "muted"
  | "success"
  | "warning";

const TagFrame = styled(XStack, {
  bg: "$surface",
  items: "center",
  justify: "center",
  name: "BeachTag",
  px: "$xs",
  py: "$xxs",
  rounded: "$full",
  variants: {
    variant: {
      default: {
        bg: "$surface",
      },
      destructive: {
        bg: "$destructiveSoft",
      },
      muted: {
        bg: "$muted",
      },
      success: {
        bg: "$successSoft",
      },
      warning: {
        bg: "$warningSoft",
      },
    },
  } as const,
});

const TagText = styled(TamaguiText, {
  color: "$surfaceForeground",
  fontFamily: "$body",
  fontSize: "$labelMd",
  fontWeight: "500",
  includeFontPadding: false,
  lineHeight: "$labelMd",
  name: "BeachTagText",
  variants: {
    variant: {
      default: {
        color: "$surfaceForeground",
      },
      destructive: {
        color: "$destructiveForeground",
      },
      muted: {
        color: "$foreground",
      },
      success: {
        color: "$foreground",
      },
      warning: {
        color: "$warningForeground",
      },
    },
  } as const,
});

export type TagProps = GetProps<typeof TagFrame> & {
  children: React.ReactNode;
  variant?: TagVariant;
};

export function Tag({ children, variant = "default", ...props }: TagProps) {
  return (
    <TagFrame variant={variant} {...props}>
      <TagText variant={variant}>{children}</TagText>
    </TagFrame>
  );
}
