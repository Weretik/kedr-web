import { type ReactNode } from 'react';
import {
  Text,
  TextInput as NativeTextInput,
  View,
  type TextInputProps as NativeTextInputProps,
} from 'react-native';

export const RadioButton = {
  Android: ({
    accessibilityLabel,
    status,
  }: {
    accessibilityLabel?: string;
    color?: string;
    status: 'checked' | 'unchecked';
    value: string;
  }) => <Text accessibilityLabel={accessibilityLabel}>{status}</Text>,
};

export function TextInput({
  left,
  right,
  ...props
}: NativeTextInputProps & { left?: ReactNode; right?: ReactNode }) {
  return (
    <View>
      {left}
      <NativeTextInput {...props} />
      {right}
    </View>
  );
}

TextInput.Icon = function TextInputIcon({
  accessibilityLabel,
  onPress,
}: {
  accessibilityLabel?: string;
  color?: string;
  icon: string;
  onPress?: () => void;
}) {
  return (
    <Text accessibilityLabel={accessibilityLabel} accessibilityRole="button" onPress={onPress}>
      Дія
    </Text>
  );
};

export function Searchbar({
  accessibilityLabel,
  maxLength,
  onChangeText,
  placeholder,
  value,
}: {
  accessibilityLabel?: string;
  maxLength?: number;
  onChangeText: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <TextInput
      accessibilityLabel={accessibilityLabel}
      maxLength={maxLength}
      onChangeText={onChangeText}
      placeholder={placeholder}
      value={value}
    />
  );
}

export function Chip({
  accessibilityLabel,
  children,
  onClose,
  onPress,
}: {
  accessibilityLabel?: string;
  children: ReactNode;
  onClose?: () => void;
  onPress?: () => void;
}) {
  return (
    <Text accessibilityLabel={accessibilityLabel} onLongPress={onClose} onPress={onPress}>
      {children}
    </Text>
  );
}

export function Button({
  accessibilityLabel,
  children,
  disabled,
  onPress,
}: {
  accessibilityLabel?: string;
  children: ReactNode;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Text
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={disabled ? undefined : onPress}
    >
      {children}
    </Text>
  );
}

export function Switch({
  accessibilityLabel,
  onValueChange,
  value,
}: {
  accessibilityLabel?: string;
  onValueChange: (value: boolean) => void;
  value: boolean;
}) {
  return (
    <NativeTextInput
      accessibilityLabel={accessibilityLabel}
      onChangeText={() => onValueChange(!value)}
      value={String(value)}
    />
  );
}
