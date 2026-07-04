import type { IconProps } from "@tamagui/helpers-icon";
import { Path, Svg } from "react-native-svg";
import { useTheme } from "tamagui";

export function GoogleBrandIcon({
  color = "$foreground",
  size = 20,
}: IconProps) {
  const fill = useBrandIconFill(color);

  return (
    <Svg fill="none" height={size} viewBox="0 0 24 24" width={size}>
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09zM12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23zM5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62zM12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill={fill}
      />
    </Svg>
  );
}

export function AppleBrandIcon({
  color = "$foreground",
  size = 21,
}: IconProps) {
  const fill = useBrandIconFill(color);

  return (
    <Svg fill="none" height={size} viewBox="0 0 23 22" width={size}>
      <Path
        d="M15.5015 5.88037C13.769 5.88037 13.0368 6.70709 11.8303 6.70709C10.5932 6.70709 9.6496 5.88639 8.14827 5.88639C6.67874 5.88639 5.11167 6.78357 4.11652 8.31197C2.71917 10.4673 2.95636 14.5265 5.21952 17.9847C6.02905 19.2226 7.11015 20.6109 8.52812 20.626H8.5539C9.78624 20.626 10.1523 19.819 11.8483 19.8096H11.8741C13.5447 19.8096 13.8799 20.6212 15.1071 20.6212H15.1328C16.5508 20.6062 17.6899 19.0679 18.4994 17.8347C19.0821 16.9478 19.2987 16.5027 19.7455 15.4994C16.4718 14.2567 15.9458 9.61564 19.1835 7.83631C18.1952 6.59881 16.8065 5.88209 15.4972 5.88209L15.5015 5.88037Z"
        fill={fill}
      />
      <Path
        d="M15.1204 1.375C14.0891 1.44504 12.886 2.1016 12.1813 2.95883C11.5419 3.7357 11.016 4.88812 11.2222 6.00574H11.3047C12.403 6.00574 13.5271 5.34445 14.1836 4.49711C14.8161 3.69059 15.2957 2.54762 15.1204 1.375Z"
        fill={fill}
      />
    </Svg>
  );
}

function useBrandIconFill(color: IconProps["color"]) {
  const theme = useTheme();

  switch (color) {
    case "$floatingSurfaceForeground":
      return theme.floatingSurfaceForeground.val;
    case "$primaryForeground":
      return theme.primaryForeground.val;
    case "$secondaryForeground":
      return theme.secondaryForeground.val;
    default:
      return theme.foreground.val;
  }
}
