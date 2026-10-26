import { Pressable, StyleSheet } from 'react-native';
import { Icon, Text } from 'react-native-paper';

import { useKedrTheme } from '../theme/kedr-theme';

export interface FilterChipProps {
  accessibilityLabel?: string;
  icon?: string;
  label: string;
  onPress: () => void;
  /** Shows a close mark; the whole chip then removes the filter. */
  removable?: boolean;
  selected?: boolean;
  testID?: string;
}

/** Pill chip that grows with its label and font scale instead of clipping it. */
export function FilterChip({
  accessibilityLabel,
  icon,
  label,
  onPress,
  removable = false,
  selected = false,
  testID,
}: Readonly<FilterChipProps>) {
  const { kedr } = useKedrTheme();
  const foreground = selected ? kedr.colors.inverseOnSurface : kedr.colors.onSurface;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? (removable ? `Прибрати фільтр ${label}` : label)}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      hitSlop={4}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? kedr.colors.inverseSurface : kedr.colors.surface,
          borderColor: selected ? kedr.colors.inverseSurface : kedr.colors.outlineVariant,
          borderRadius: kedr.radius.pill,
        },
      ]}
      testID={testID}
    >
      {icon ? <Icon color={foreground} size={16} source={icon} /> : null}
      <Text numberOfLines={1} style={[styles.label, { color: foreground }]} variant="labelMedium">
        {label}
      </Text>
      {removable ? <Icon color={foreground} size={14} source="close" /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    maxWidth: 260,
    minHeight: 34,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  label: { flexShrink: 1 },
});
