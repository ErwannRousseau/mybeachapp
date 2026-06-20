export type ButtonGlintPlatform = "android" | "ios" | string;

export type ButtonGlintPolicyOptions = {
  disabled?: boolean;
  disableGlint?: boolean;
  glass?: boolean;
  glint?: boolean;
  platform: ButtonGlintPlatform;
  size: "icon" | "md" | "sm";
  variant: "destructive" | "ghost" | "primary" | "secondary" | "text";
};

export function shouldShowButtonGlint({
  disabled,
  disableGlint,
  glass,
  glint,
  platform,
  size,
  variant,
}: ButtonGlintPolicyOptions) {
  if (!glint || disabled || disableGlint) {
    return false;
  }

  if (platform === "ios" || size === "icon") {
    return false;
  }

  if (variant === "ghost" || variant === "text") {
    return false;
  }

  return !glass || platform === "android";
}
