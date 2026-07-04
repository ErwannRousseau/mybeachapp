import { type GetProps, Separator as TamaguiSeparator } from "tamagui";

export function Separator(props: GetProps<typeof TamaguiSeparator>) {
  return <TamaguiSeparator {...props} />;
}
