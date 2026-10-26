import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { useKedrTheme } from '../theme/kedr-theme';

export interface SearchFieldProps {
  accessibilityLabel?: string;
  onChangeText?: (value: string) => void;
  /** When set without `onChangeText`, the field acts as a button (opens a search sheet). */
  onPress?: () => void;
  onSubmit?: () => void;
  onTrailingPress?: () => void;
  placeholder: string;
  testID?: string;
  trailingBadge?: number;
  trailingIcon?: string;
  trailingLabel?: string;
  value?: string;
}

export function SearchField({
  accessibilityLabel,
  onChangeText,
  onPress,
  onSubmit,
  onTrailingPress,
  placeholder,
  testID,
  trailingBadge,
  trailingIcon,
  trailingLabel,
  value,
}: Readonly<SearchFieldProps>) {
  const { kedr } = useKedrTheme();
  const readOnly = !onChangeText;

  const field = (
    <View
      style={[
        styles.field,
        { backgroundColor: kedr.colors.surface, borderRadius: kedr.radius.pill },
      ]}
    >
      <Icon color={kedr.colors.onSurfaceVariant} size={20} source="magnify" />
      <TextInput
        accessibilityLabel={accessibilityLabel ?? placeholder}
        editable={!readOnly}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={kedr.colors.onSurfaceVariant}
        pointerEvents={readOnly ? 'none' : 'auto'}
        returnKeyType="search"
        style={[styles.input, { color: kedr.colors.onSurface, fontFamily: kedr.fonts.textRegular }]}
        testID={testID}
        value={value}
      />
      {trailingIcon && onTrailingPress ? (
        <Pressable
          accessibilityLabel={trailingLabel}
          accessibilityRole="button"
          onPress={onTrailingPress}
          style={[styles.trailing, { backgroundColor: kedr.colors.inverseSurface }]}
        >
          <Icon color={kedr.colors.inverseOnSurface} size={18} source={trailingIcon} />
          {trailingBadge ? (
            <View
              style={[
                styles.badge,
                { backgroundColor: kedr.colors.primary, borderColor: kedr.colors.surface },
              ]}
            />
          ) : null}
        </Pressable>
      ) : null}
    </View>
  );

  return readOnly && onPress ? (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? placeholder}
      accessibilityRole="search"
      onPress={onPress}
    >
      {field}
    </Pressable>
  ) : (
    field
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 5,
    borderWidth: 2,
    height: 10,
    position: 'absolute',
    right: 2,
    top: 2,
    width: 10,
  },
  field: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    minHeight: 48,
    paddingLeft: 16,
    paddingRight: 5,
  },
  input: { flex: 1, fontSize: 14, minHeight: 44, paddingVertical: 8 },
  trailing: {
    alignItems: 'center',
    borderRadius: 19,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
});
