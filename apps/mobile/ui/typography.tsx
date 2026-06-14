import { type GetProps, SizableText, styled } from "tamagui";

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

const TextFrame = styled(SizableText, {
  color: "$foreground",
  fontFamily: "$body",
  letterSpacing: 0,
  name: "BeachText",
  size: "$bodyMd",
  variants: {
    textSize: {
      lg: {
        size: "$titleSm",
      },
      md: {
        size: "$bodyMd",
      },
      sm: {
        size: "$labelMd",
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

export type TextProps = Omit<GetProps<typeof TextFrame>, "size"> & {
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
  fontWeight: "700",
  name: "BeachTitle",
  size: "$headlineMd",
  variants: {
    titleSize: {
      md: {
        size: "$headlineMd",
      },
      sm: {
        size: "$titleSm",
      },
    },
  } as const,
});

export type TitleProps = Omit<GetProps<typeof TitleFrame>, "size"> & {
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
  fontWeight: "700",
  name: "BeachHeadline",
  size: "$headlineLg",
  variants: {
    headlineSize: {
      display: {
        size: "$headlineDisplay",
      },
      lg: {
        size: "$headlineLg",
      },
      md: {
        size: "$headlineLg",
      },
    },
  } as const,
});

export type HeadlineProps = Omit<GetProps<typeof HeadlineFrame>, "size"> & {
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
