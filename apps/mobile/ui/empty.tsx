import { type GetProps, styled, XStack, YStack } from "tamagui";

import { Text, type TextProps, Title, type TitleProps } from "./typography";

const EmptyFrame = styled(YStack, {
  bg: "$muted",
  borderColor: "$border",
  borderWidth: 1,
  gap: "$md",
  items: "center",
  name: "BeachEmpty",
  p: "$lg",
  rounded: "$xl",
});

export type EmptyProps = GetProps<typeof EmptyFrame> & {
  children: React.ReactNode;
};

export function Empty({ children, ...props }: EmptyProps) {
  return <EmptyFrame {...props}>{children}</EmptyFrame>;
}

const EmptyHeaderFrame = styled(YStack, {
  gap: "$sm",
  items: "center",
  name: "BeachEmptyHeader",
});

export type EmptyHeaderProps = GetProps<typeof EmptyHeaderFrame> & {
  children: React.ReactNode;
};

export function EmptyHeader({ children, ...props }: EmptyHeaderProps) {
  return <EmptyHeaderFrame {...props}>{children}</EmptyHeaderFrame>;
}

export type EmptyMediaVariant = "icon";

const EmptyMediaFrame = styled(XStack, {
  bg: "$surface",
  borderColor: "$border",
  borderWidth: 1,
  height: 56,
  items: "center",
  justify: "center",
  name: "BeachEmptyMedia",
  rounded: "$full",
  variants: {
    variant: {
      icon: {},
    },
  } as const,
  width: 56,
});

export type EmptyMediaProps = GetProps<typeof EmptyMediaFrame> & {
  children: React.ReactNode;
  variant?: EmptyMediaVariant;
};

export function EmptyMedia({
  children,
  variant = "icon",
  ...props
}: EmptyMediaProps) {
  return (
    <EmptyMediaFrame variant={variant} {...props}>
      {children}
    </EmptyMediaFrame>
  );
}

export type EmptyTitleProps = TitleProps;

export function EmptyTitle({ children, ...props }: EmptyTitleProps) {
  return (
    <Title selectable size="sm" text="center" {...props}>
      {children}
    </Title>
  );
}

export type EmptyDescriptionProps = TextProps;

export function EmptyDescription({
  children,
  ...props
}: EmptyDescriptionProps) {
  return (
    <Text selectable text="center" variant="muted" {...props}>
      {children}
    </Text>
  );
}

const EmptyContentFrame = styled(YStack, {
  gap: "$sm",
  items: "stretch",
  name: "BeachEmptyContent",
  self: "stretch",
});

export type EmptyContentProps = GetProps<typeof EmptyContentFrame> & {
  children: React.ReactNode;
};

export function EmptyContent({ children, ...props }: EmptyContentProps) {
  return <EmptyContentFrame {...props}>{children}</EmptyContentFrame>;
}
