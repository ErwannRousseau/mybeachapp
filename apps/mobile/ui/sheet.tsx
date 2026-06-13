import { type GetProps, styled, Sheet as TamaguiSheet } from "tamagui";

export type SheetProps = React.ComponentProps<typeof TamaguiSheet>;

export function Sheet({ children, ...props }: SheetProps) {
  return (
    <TamaguiSheet dismissOnSnapToBottom modal {...props}>
      {children}
    </TamaguiSheet>
  );
}

const SheetFrameBase = styled(TamaguiSheet.Frame, {
  bg: "$surface",
  borderTopLeftRadius: "$xxl",
  borderTopRightRadius: "$xxl",
  gap: "$md",
  p: "$lg",
});

export type SheetFrameProps = GetProps<typeof SheetFrameBase>;

export function SheetFrame({ children, ...props }: SheetFrameProps) {
  return <SheetFrameBase {...props}>{children}</SheetFrameBase>;
}

export type SheetHeaderProps = GetProps<typeof TamaguiSheet.Handle>;

export function SheetHandle(props: SheetHeaderProps) {
  return <TamaguiSheet.Handle {...props} />;
}

export function SheetOverlay(
  props: React.ComponentProps<typeof TamaguiSheet.Overlay>,
) {
  return <TamaguiSheet.Overlay {...props} />;
}
