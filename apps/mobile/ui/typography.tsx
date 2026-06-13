import { type GetProps, styled, Text as TamaguiText } from "tamagui";

export type TextVariant =
  | "accent"
  | "default"
  | "destructive"
  | "muted"
  | "primary"
  | "secondary"
  | "subtle";
export type TextSize = "lg" | "md" | "sm";
export type TextWeight = "bold" | "medium" | "regular" | "semibold";

const TextFrame = styled(TamaguiText, {
  color: "$foreground",
  fontFamily: "$body",
  fontSize: 16,
  letterSpacing: 0,
  lineHeight: 24,
  name: "BeachText",
  variants: {
    textSize: {
      lg: {
        fontSize: 18,
        lineHeight: 26,
      },
      md: {
        fontSize: 16,
        lineHeight: 24,
      },
      sm: {
        fontSize: 13,
        lineHeight: 18,
      },
    },
    variant: {
      accent: {
        color: "$accent",
      },
      default: {
        color: "$foreground",
      },
      destructive: {
        color: "$destructive",
      },
      muted: {
        color: "$mutedForeground",
      },
      primary: {
        color: "$primary",
      },
      secondary: {
        color: "$secondaryForeground",
      },
      subtle: {
        color: "$mutedForeground",
      },
    },
    weight: {
      bold: {
        fontWeight: "700",
      },
      medium: {
        fontWeight: "500",
      },
      regular: {
        fontWeight: "400",
      },
      semibold: {
        fontWeight: "600",
      },
    },
  } as const,
});

export type TextProps = GetProps<typeof TextFrame> & {
  children?: React.ReactNode;
  size?: TextSize;
};

export function Text({
  children,
  size = "md",
  variant = "default",
  weight = "regular",
  ...props
}: TextProps) {
  return (
    <TextFrame textSize={size} variant={variant} weight={weight} {...props}>
      {children}
    </TextFrame>
  );
}

const TitleFrame = styled(TextFrame, {
  fontSize: 22,
  fontWeight: "700",
  lineHeight: 28,
  name: "BeachTitle",
  variants: {
    titleSize: {
      md: {
        fontSize: 22,
        lineHeight: 28,
      },
      sm: {
        fontSize: 18,
        lineHeight: 24,
      },
    },
  } as const,
});

export type TitleProps = GetProps<typeof TitleFrame> & {
  children?: React.ReactNode;
  size?: "md" | "sm";
};

export function Title({
  children,
  size = "md",
  variant = "default",
  ...props
}: TitleProps) {
  return (
    <TitleFrame titleSize={size} variant={variant} {...props}>
      {children}
    </TitleFrame>
  );
}

const HeadlineFrame = styled(TextFrame, {
  fontSize: 28,
  fontWeight: "700",
  lineHeight: 34,
  name: "BeachHeadline",
  variants: {
    headlineSize: {
      display: {
        fontSize: 34,
        lineHeight: 40,
      },
      lg: {
        fontSize: 28,
        lineHeight: 34,
      },
      md: {
        fontSize: 28,
        lineHeight: 34,
      },
    },
  } as const,
});

export type HeadlineProps = GetProps<typeof HeadlineFrame> & {
  children?: React.ReactNode;
  size?: "display" | "lg" | "md";
};

export function Headline({
  children,
  size = "md",
  variant = "default",
  ...props
}: HeadlineProps) {
  return (
    <HeadlineFrame headlineSize={size} variant={variant} {...props}>
      {children}
    </HeadlineFrame>
  );
}
