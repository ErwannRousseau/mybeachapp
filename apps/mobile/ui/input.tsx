import { type GetProps, styled, Input as TamaguiInput } from "tamagui";

const InputFrame = styled(TamaguiInput, {
  bg: "$surface",
  borderColor: "$input",
  borderWidth: 1,
  color: "$foreground",
  disabledStyle: {
    bg: "$muted",
  },
  focusStyle: {
    borderColor: "$ring",
  },
  fontSize: "$bodyMd",
  minH: "$input",
  name: "BeachInput",
  placeholderTextColor: "$mutedForeground",
  px: "$md",
  rounded: "$lg",
  variants: {
    invalid: {
      true: {
        borderColor: "$destructive",
      },
    },
  } as const,
});

export type InputProps = Omit<GetProps<typeof InputFrame>, "invalid"> & {
  invalid?: boolean;
};

export function Input({ invalid = false, ...props }: InputProps) {
  return <InputFrame invalid={invalid} {...props} />;
}
