import { Pressable } from 'react-native';

import { createStyles, useStyles } from '../../theme/styling/create-styles';
import { Icon, type IconName } from '../text/icon';

import type { Tone } from '../text/tone';

export interface IconButtonProps {
  accessibilityLabel: string;
  disabled?: boolean;
  icon: IconName;
  onPress: () => void;
  /** An on/off toggle that is on: ink fill, like a selected chip. */
  selected?: boolean;
  /** `filled` is the green «+» of a product row. */
  variant?: 'filled' | 'outlined' | 'plain';
}

export function IconButton({
  accessibilityLabel,
  disabled = false,
  icon,
  onPress,
  selected,
  variant = 'plain',
}: Readonly<IconButtonProps>) {
  const styles = useStyles(stylesSheet);
  const tone: Tone = disabled
    ? 'disabled'
    : selected === true
      ? 'inverse'
      : variant === 'filled'
        ? 'onAction'
        : 'default';

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={selected === undefined ? { disabled } : { disabled, selected }}
      disabled={disabled}
      hitSlop={4}
      onPress={onPress}
      style={({ pressed }) => styles.button(variant, disabled, pressed, selected === true)}
    >
      <Icon name={icon} size={22} tone={tone} />
    </Pressable>
  );
}

const stylesSheet = createStyles((theme) => ({
  button: (
    variant: IconButtonProps['variant'],
    disabled: boolean,
    pressed: boolean,
    selected: boolean,
  ) => ({
    alignItems: 'center',
    backgroundColor: selected
      ? theme.colors.text
      : variant === 'filled'
        ? disabled
          ? theme.colors.surfaceMuted
          : theme.colors.action
        : variant === 'outlined'
          ? theme.colors.surface
          : 'transparent',
    borderColor: selected ? theme.colors.text : theme.colors.outline,
    borderRadius: theme.radius.md,
    borderWidth: variant === 'outlined' ? theme.sizes.border : 0,
    height: theme.sizes.iconButton,
    justifyContent: 'center',
    opacity: pressed ? theme.motion.pressedOpacity : 1,
    width: theme.sizes.iconButton,
  }),
}));
