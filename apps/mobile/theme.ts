const sharedColors = {
  astral: "#2E78B7",
  azureRadiance: "#007AFF",
  cornflowerBlue: "#6366F1",
  limedSpruce: "#38434D",
} as const;

export const lightTheme = {
  colors: {
    ...sharedColors,
    background: "#ffffff",
    typography: "#000000",
  },
  margins: {
    lg: 8,
    md: 4,
    sm: 2,
    xl: 12,
  },
} as const;

export const darkTheme = {
  colors: {
    ...sharedColors,
    background: "#000000",
    typography: "#ffffff",
  },
  margins: {
    lg: 8,
    md: 4,
    sm: 2,
    xl: 12,
  },
} as const;
