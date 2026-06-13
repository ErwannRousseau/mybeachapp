import { type GetProps, styled, Text as TamaguiText, XStack } from "tamagui";

const TagFrame = styled(XStack, {
  bg: "$surface",
  items: "center",
  justify: "center",
  name: "BeachTag",
  px: 10,
  py: 4,
  rounded: "$full",
});

const TagText = styled(TamaguiText, {
  color: "$surfaceForeground",
  fontFamily: "$body",
  fontSize: 13,
  fontWeight: "500",
  includeFontPadding: false,
  lineHeight: 18,
  name: "BeachTagText",
});

export type TagProps = GetProps<typeof TagFrame> & {
  children: React.ReactNode;
};

export function Tag({ children, ...props }: TagProps) {
  return (
    <TagFrame {...props}>
      <TagText>{children}</TagText>
    </TagFrame>
  );
}
