import { type GetProps, styled, Input as TamaguiInput } from "tamagui";

export type InputState = "default" | "disabled" | "error" | "focused";

const InputFrame = styled(TamaguiInput, {
  bg: "$surface",
  borderColor: "$input",
  borderWidth: 1,
  color: "$foreground",
  fontSize: 16,
  minH: 52,
  name: "BeachInput",
  placeholderTextColor: "$mutedForeground",
  px: "$md",
  rounded: "$lg",
  variants: {
    inputState: {
      default: {},
      disabled: {
        bg: "$muted",
        color: "$mutedForeground",
      },
      error: {
        borderColor: "$destructive",
      },
      focused: {
        borderColor: "$ring",
      },
    },
  } as const,
});

export type InputProps = GetProps<typeof InputFrame> & {
  inputState?: InputState;
};

export function Input({ inputState = "default", ...props }: InputProps) {
  return <InputFrame inputState={inputState} {...props} />;
}
