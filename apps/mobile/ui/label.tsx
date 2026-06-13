import { type GetProps, styled, Label as TamaguiLabel } from "tamagui";

const LabelFrame = styled(TamaguiLabel, {
  color: "$foreground",
  fontSize: 13,
  fontWeight: "600",
  lineHeight: 18,
  name: "BeachLabel",
});

export type LabelProps = GetProps<typeof LabelFrame> & {
  children?: React.ReactNode;
};

export function Label({ children, ...props }: LabelProps) {
  return <LabelFrame {...props}>{children}</LabelFrame>;
}
