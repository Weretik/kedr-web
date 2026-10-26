import { type ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { Icon, Text } from 'react-native-paper';

import { useKedrTheme } from '../theme/kedr-theme';

export interface ActionPillButtonProps {
  accessibilityLabel?: string;
  children: ReactNode;
  disabled?: boolean;
  icon?: string;
  loading?: boolean;
  onPress: () => void;
  testID?: string;
}

/** Green pill button used as the main action, typically inside ActionBar. */
export function ActionPillButton({
  accessibilityLabel,
  children,
  disabled,
  icon,
  loading,
  onPress,
  testID,
}: Readonly<ActionPillButtonProps>) {
  const { kedr } = useKedrTheme();
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: inactive }}
      disabled={inactive}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: kedr.colors.primary,
          borderRadius: kedr.radius.pill,
          opacity: inactive ? 0.55 : 1,
        },
      ]}
      testID={testID}
    >
      {loading ? <ActivityIndicator color={kedr.colors.onPrimary} size="small" /> : null}
      <Text
        numberOfLines={1}
        style={[styles.label, { color: kedr.colors.onPrimary }]}
        variant="labelLarge"
      >
        {children}
      </Text>
      {icon && !loading ? <Icon color={kedr.colors.onPrimary} size={18} source={icon} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginLeft: 'auto',
    minHeight: 48,
    paddingHorizontal: 18,
  },
  label: { flexShrink: 1 },
});
