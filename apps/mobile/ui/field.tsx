import { type GetProps, styled, Label as TamaguiLabel, YStack } from "tamagui";

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

const FieldLabelFrame = styled(TamaguiLabel, {
  color: "$foreground",
  fontFamily: "$body",
  fontWeight: "600",
  name: "BeachFieldLabel",
  size: "$labelMd",
});

export type FieldLabelProps = GetProps<typeof FieldLabelFrame> & {
  children?: React.ReactNode;
};

export function FieldLabel({ children, ...props }: FieldLabelProps) {
  return <FieldLabelFrame {...props}>{children}</FieldLabelFrame>;
}

export type FieldDescriptionProps = TextProps;

export function FieldDescription({
  children,
  ...props
}: FieldDescriptionProps) {
  return (
    <Text selectable size="sm" variant="muted" {...props}>
      {children}
    </Text>
  );
}

export type FieldErrorProps = TextProps;

export function FieldError({ children, ...props }: FieldErrorProps) {
  return (
    <Text size="sm" variant="destructive" {...props}>
      {children}
    </Text>
  );
}
