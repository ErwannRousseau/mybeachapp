import { Text } from "tamagui";

type IconProps = {
  color?: string;
  size?: number;
  strokeWidth?: number;
};

function IconMock({ size }: IconProps) {
  return <Text fontSize={size}>icon</Text>;
}

export function Circle(props: IconProps) {
  return <IconMock {...props} />;
}

export function List(props: IconProps) {
  return <IconMock {...props} />;
}

function LucideMap(props: IconProps) {
  return <IconMock {...props} />;
}

export { LucideMap as Map };

export function PlusCircle(props: IconProps) {
  return <IconMock {...props} />;
}

export function Search(props: IconProps) {
  return <IconMock {...props} />;
}

export function UserCircle(props: IconProps) {
  return <IconMock {...props} />;
}
