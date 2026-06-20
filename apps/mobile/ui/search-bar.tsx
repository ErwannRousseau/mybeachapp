import { Search } from "@tamagui/lucide-icons-2";
import { useCallback } from "react";
import { type GetProps, styled, Input as TamaguiInput, XStack } from "tamagui";

const SearchBarFrame = styled(XStack, {
  bg: "$surface",
  borderColor: "$border",
  borderWidth: 1,
  gap: "$sm",
  items: "center",
  minH: 52,
  name: "BeachSearchBar",
  px: "$md",
  rounded: "$xl",
});

const SearchInput = styled(TamaguiInput, {
  bg: "$transparent",
  borderWidth: 0,
  color: "$foreground",
  flex: 1,
  fontSize: "$bodyMd",
  height: "$touchPreferred",
  placeholderTextColor: "$mutedForeground",
  px: 0,
});

export type SearchBarProps = GetProps<typeof SearchInput> & {
  onSearch?: (searchText: string) => void;
  placeholder?: string;
};

export function SearchBar({
  onSearch,
  onSubmitEditing,
  placeholder,
  ...props
}: SearchBarProps) {
  const handleSubmitEditing = useCallback(
    (event: Parameters<NonNullable<SearchBarProps["onSubmitEditing"]>>[0]) => {
      onSubmitEditing?.(event);
      onSearch?.(event.nativeEvent.text);
    },
    [onSearch, onSubmitEditing],
  );

  return (
    <SearchBarFrame>
      <Search color="$mutedForeground" size={18} />
      <SearchInput
        placeholder={placeholder}
        returnKeyType="search"
        {...props}
        onSubmitEditing={handleSubmitEditing}
      />
    </SearchBarFrame>
  );
}
