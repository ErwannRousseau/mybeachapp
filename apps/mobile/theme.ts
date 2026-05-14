const colors = {
  background: "#F8FBFA",
  border: "#DDE7E5",
  borderStrong: "#9BAAAD",
  error: "#E85739",
  errorSoft: "#FCE4DC",
  glassTint: "#FFFFFF",
  onPrimary: "#062A3B",
  onSurface: "#062A3B",
  onSurfaceMuted: "#6B7C86",
  onSurfaceSubtle: "#9BAAAD",
  primary: "#FF6B4A",
  primaryHover: "#C9442A",
  primaryPressed: "#9F331F",
  secondary: "#0077B6",
  secondaryHover: "#00A6D6",
  secondarySoft: "#EAF8FC",
  success: "#1FAF84",
  successSoft: "#E5F5EE",
  surface: "#FFFFFF",
  surfaceSoft: "#EEF4F3",
  warning: "#DDBB72",
  warningSoft: "#FFF9EA",
} as const;

const spacing = {
  lg: 20,
  md: 16,
  sm: 12,
  touchMin: 44,
  xl: 24,
  xs: 8,
  xxl: 32,
  xxs: 4,
} as const;

const radii = {
  full: 9999,
  lg: 20,
  md: 16,
  sm: 12,
  xl: 24,
  xs: 8,
  xxl: 32,
} as const;

const typography = {
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  bodyStrong: {
    fontSize: 16,
    fontWeight: "600" as const,
    lineHeight: 24,
  },
  headline: {
    fontSize: 28,
    fontWeight: "700" as const,
    lineHeight: 34,
  },
  label: {
    fontSize: 13,
    fontWeight: "500" as const,
    lineHeight: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: "700" as const,
    lineHeight: 28,
  },
} as const;

export const lightTheme = {
  colors,
  radii,
  spacing,
  typography,
} as const;

export const darkTheme = {
  colors: {
    ...colors,
    background: "#062A3B",
    border: "#245166",
    onPrimary: "#062A3B",
    onSurface: "#F8FBFA",
    onSurfaceMuted: "#B8C8CC",
    onSurfaceSubtle: "#8FA3A9",
    secondarySoft: "#123E55",
    surface: "#0B3447",
    surfaceSoft: "#123E55",
  },
  radii,
  spacing,
  typography,
} as const;
