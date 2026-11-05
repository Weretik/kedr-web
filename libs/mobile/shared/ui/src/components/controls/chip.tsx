import { Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppText } from '../text/app-text';
import { Icon, type IconName } from '../text/icon';

export interface ChipProps {
  icon?: IconName;
  label: string;
  onPress: () => void;
  selected?: boolean;
}

/** Filter and category chip; selected = ink fill with white text. */
export function Chip({ icon, label, onPress, selected = false }: Readonly<ChipProps>) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => styles.chip(selected, pressed)}
    >
      {icon ? <Icon name={icon} size={16} tone={selected ? 'onAction' : 'default'} /> : null}
      <AppText style={styles.label(selected)} variant="caption">
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  chip: (selected: boolean, pressed: boolean) => ({
    alignItems: 'center',
    backgroundColor: selected ? theme.colors.text : theme.colors.surface,
    borderColor: selected ? theme.colors.text : theme.colors.outline,
    borderRadius: theme.radius.pill,
    borderWidth: theme.sizes.border,
    flexDirection: 'row',
    gap: theme.space.xs,
    minHeight: 32,
    opacity: pressed ? theme.motion.pressedOpacity : 1,
    paddingHorizontal: theme.space.md,
  }),
  label: (selected: boolean) => ({
    color: selected ? theme.colors.background : theme.colors.text,
    fontSize: 13,
  }),
}));
