import { AUTH_EMAIL_OTP_LENGTH } from "@mybeachapp/shared/auth/constants";
import * as Clipboard from "expo-clipboard";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import { Input as TamaguiInput, XStack, YStack } from "tamagui";

import { Button } from "@/ui/button";

type FocusableInput = {
  blur: () => void;
  focus: () => void;
};

type OtpKeyPressEvent = {
  nativeEvent: {
    key: string;
  };
};

export type OtpInputProps = {
  autoFocus?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  length?: number;
  onCodeChange: (code: string) => void;
  value: string;
};

export function OtpInput({
  autoFocus = false,
  disabled = false,
  invalid = false,
  length = AUTH_EMAIL_OTP_LENGTH,
  onCodeChange,
  value,
}: OtpInputProps) {
  const { width: windowWidth } = useWindowDimensions();
  const inputRefs = useRef<Array<FocusableInput | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState(
    value.length === length ? -1 : 0,
  );
  const digits = useMemo(() => splitCode(value, length), [length, value]);
  const inputKeys = useMemo(
    () => Array.from({ length }, (_, index) => `otp-slot-${index + 1}`),
    [length],
  );
  const inputWidth = Math.floor(
    (Math.min(340, windowWidth - 32) - 40) / length,
  );
  const isFilled = value.length === length;

  const updateCode = useCallback(
    (nextValue: string) => {
      if (disabled) {
        return;
      }

      const code = sanitizeCode(nextValue, length);
      onCodeChange(code);

      if (code.length === length) {
        setFocusedIndex(-1);
        inputRefs.current[length - 1]?.blur();
        return;
      }

      const nextIndex = Math.min(code.length, length - 1);
      setFocusedIndex(nextIndex);
      inputRefs.current[nextIndex]?.focus();
    },
    [disabled, length, onCodeChange],
  );

  const updateDigit = useCallback(
    (nextValue: string, index: number) => {
      if (disabled) {
        return;
      }

      if (nextValue.length > 1) {
        updateCode(nextValue);
        return;
      }

      const nextDigits = [...digits];
      nextDigits[index] = sanitizeCode(nextValue, 1);
      const nextCode = nextDigits.join("");
      onCodeChange(nextCode);

      if (nextValue && index < length - 1) {
        setFocusedIndex(index + 1);
        inputRefs.current[index + 1]?.focus();
        return;
      }

      if (index === length - 1 && nextValue) {
        setFocusedIndex(-1);
        inputRefs.current[index]?.blur();
      }
    },
    [digits, disabled, length, onCodeChange, updateCode],
  );

  const handleBackspace = useCallback(
    (key: string, index: number) => {
      if (disabled) {
        return;
      }

      if (key !== "Backspace") {
        return;
      }

      const nextDigits = [...digits];
      const previousIndex = Math.max(0, index - 1);

      if (digits[index]) {
        nextDigits[index] = "";
        onCodeChange(nextDigits.join(""));
        return;
      }

      nextDigits[previousIndex] = "";
      onCodeChange(nextDigits.join(""));
      setFocusedIndex(previousIndex);
      inputRefs.current[previousIndex]?.focus();
    },
    [digits, disabled, onCodeChange],
  );

  const blurHandlers = useMemo(
    () =>
      inputKeys.map((_, index) => () => {
        if (focusedIndex === index) {
          setFocusedIndex(-1);
        }
      }),
    [focusedIndex, inputKeys],
  );
  const changeHandlers = useMemo(
    () =>
      inputKeys.map(
        (_, index) => (nextValue: string) => updateDigit(nextValue, index),
      ),
    [inputKeys, updateDigit],
  );
  const focusHandlers = useMemo(
    () => inputKeys.map((_, index) => () => setFocusedIndex(index)),
    [inputKeys],
  );
  const keyPressHandlers = useMemo(
    () =>
      inputKeys.map(
        (_, index) => (event: OtpKeyPressEvent) =>
          handleBackspace(event.nativeEvent.key, index),
      ),
    [handleBackspace, inputKeys],
  );
  const refHandlers = useMemo(
    () =>
      inputKeys.map((_, index) => (ref: FocusableInput | null) => {
        inputRefs.current[index] = ref;
      }),
    [inputKeys],
  );

  const pasteCode = useCallback(async () => {
    if (disabled) {
      return;
    }

    const text = await Clipboard.getStringAsync();
    updateCode(text);
  }, [disabled, updateCode]);

  useEffect(() => {
    if (!autoFocus) {
      return;
    }

    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 400);

    return () => clearTimeout(timer);
  }, [autoFocus]);

  return (
    <YStack gap="$sm" items="center">
      <XStack gap="$xs" justify="center">
        {inputKeys.map((inputKey, index) => {
          const digit = digits[index] ?? "";
          const isFocused = focusedIndex === index;

          return (
            <TamaguiInput
              autoComplete={index === 0 ? "one-time-code" : undefined}
              bg="$surface"
              borderColor={
                invalid ? "$destructive" : isFocused ? "$ring" : "$border"
              }
              borderWidth={1}
              color="$foreground"
              disabled={disabled}
              disabledStyle={{
                opacity: 0.55,
              }}
              focusStyle={{
                borderColor: invalid ? "$destructive" : "$ring",
              }}
              fontSize="$headlineMd"
              height={inputWidth}
              inputMode="numeric"
              key={inputKey}
              keyboardType="number-pad"
              maxLength={1}
              onBlur={blurHandlers[index]}
              onChangeText={changeHandlers[index]}
              onFocus={focusHandlers[index]}
              onKeyPress={keyPressHandlers[index]}
              ref={refHandlers[index]}
              rounded="$sm"
              selectTextOnFocus
              text="center"
              textContentType={index === 0 ? "oneTimeCode" : undefined}
              value={digit}
              width={inputWidth}
            />
          );
        })}
      </XStack>

      <Button
        disabled={disabled || isFilled}
        fullWidth={false}
        onPress={pasteCode}
        opacity={disabled || isFilled ? 0 : 1}
        size="sm"
        variant="text"
      >
        Coller le code
      </Button>
    </YStack>
  );
}

function sanitizeCode(value: string, maxLength: number) {
  return value.replace(/\D/g, "").slice(0, maxLength);
}

function splitCode(value: string, length: number) {
  const code = sanitizeCode(value, length);
  return Array.from({ length }, (_, index) => code[index] ?? "");
}
