import { type GetProps, styled, YStack } from "tamagui";

import { Text, type TextProps } from "./typography";

const FieldFrame = styled(YStack, {
  gap: "$xs",
  name: "BeachField",
});

export type FieldProps = GetProps<typeof FieldFrame> & {
  children?: React.ReactNode;
};

export function Field({ children, ...props }: FieldProps) {
  return <FieldFrame {...props}>{children}</FieldFrame>;
}

export type FieldErrorProps = TextProps;

export function FieldError({ children, ...props }: FieldErrorProps) {
  return (
    <Text size="sm" variant="destructive" {...props}>
      {children}
    </Text>
  );
}
