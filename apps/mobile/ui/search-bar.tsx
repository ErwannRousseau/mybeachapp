import { Ionicons } from "@expo/vector-icons";
import {
  type GetProps,
  styled,
  Input as TamaguiInput,
  useTheme,
  XStack,
} from "tamagui";

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
  fontSize: 16,
  height: 48,
  placeholderTextColor: "$mutedForeground",
  px: 0,
});

export type SearchBarProps = GetProps<typeof SearchInput> & {
  onSearch?: (searchText: string) => void;
  placeholder: string;
};

export function SearchBar({
  onSearch,
  onSubmitEditing,
  placeholder,
  ...props
}: SearchBarProps) {
  const theme = useTheme();

  return (
    <SearchBarFrame>
      <Ionicons color={theme.mutedForeground.val} name="search" size={18} />
      <SearchInput
        placeholder={placeholder}
        returnKeyType="search"
        {...props}
        onSubmitEditing={(event) => {
          onSubmitEditing?.(event);
          onSearch?.(event.nativeEvent.text);
        }}
      />
    </SearchBarFrame>
  );
}
