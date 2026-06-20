import { useSafeAreaInsets } from "react-native-safe-area-context";
import { type GetProps, styled, Sheet as TamaguiSheet, YStack } from "tamagui";

import { Text, type TextProps, Title, type TitleProps } from "./typography";

const SheetFrame = styled(TamaguiSheet.Frame, {
  bg: "$surface",
  borderTopLeftRadius: "$xxl",
  borderTopRightRadius: "$xxl",
  gap: "$md",
  name: "BeachSheetFrame",
  p: "$lg",
});

const SheetBackdrop = styled(TamaguiSheet.Overlay, {
  bg: "$foreground",
  enterStyle: {
    opacity: 0,
  },
  exitStyle: {
    opacity: 0,
  },
  name: "BeachSheetBackdrop",
  opacity: 0.18,
});

const SheetHandle = styled(TamaguiSheet.Handle, {
  bg: "$border",
  name: "BeachSheetHandle",
});

export type SheetProps = React.ComponentProps<typeof TamaguiSheet> & {
  children: React.ReactNode;
};

export function Sheet({ children, ...props }: SheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <TamaguiSheet dismissOnSnapToBottom modal snapPointsMode="fit" {...props}>
      <SheetBackdrop />
      <SheetFrame pb={insets.bottom + 20}>
        <SheetHandle />
        {children}
      </SheetFrame>
    </TamaguiSheet>
  );
}

const SheetHeaderFrame = styled(YStack, {
  gap: "$md",
  name: "BeachSheetHeader",
});

export type SheetHeaderProps = GetProps<typeof SheetHeaderFrame> & {
  children: React.ReactNode;
};

export function SheetHeader({ children, ...props }: SheetHeaderProps) {
  return <SheetHeaderFrame {...props}>{children}</SheetHeaderFrame>;
}

const SheetBodyFrame = styled(YStack, {
  gap: "$md",
  name: "BeachSheetBody",
});

export type SheetBodyProps = GetProps<typeof SheetBodyFrame> & {
  children: React.ReactNode;
};

export function SheetBody({ children, ...props }: SheetBodyProps) {
  return <SheetBodyFrame {...props}>{children}</SheetBodyFrame>;
}

const SheetActionsFrame = styled(YStack, {
  gap: "$sm",
  name: "BeachSheetActions",
});

export type SheetActionsProps = GetProps<typeof SheetActionsFrame> & {
  children: React.ReactNode;
};

export function SheetActions({ children, ...props }: SheetActionsProps) {
  return <SheetActionsFrame {...props}>{children}</SheetActionsFrame>;
}

export type SheetTitleProps = TitleProps;

export function SheetTitle({ children, ...props }: SheetTitleProps) {
  return (
    <Title selectable size="sm" {...props}>
      {children}
    </Title>
  );
}

export type SheetDescriptionProps = TextProps;

export function SheetDescription({
  children,
  ...props
}: SheetDescriptionProps) {
  return (
    <Text selectable variant="muted" {...props}>
      {children}
    </Text>
  );
}
