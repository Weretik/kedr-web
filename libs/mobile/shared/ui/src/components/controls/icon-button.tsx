import { Pressable } from 'react-native';

import { createStyles, useStyles } from '../../theme/create-styles';
import { Icon, type IconName } from '../text/icon';

import type { Tone } from '../tone';

export interface IconButtonProps {
  accessibilityLabel: string;
  disabled?: boolean;
  icon: IconName;
  onPress: () => void;
  /** `filled` is the green «+» of a product row. */
  variant?: 'filled' | 'outlined' | 'plain';
}

export function IconButton({
  accessibilityLabel,
  disabled = false,
  icon,
  onPress,
  variant = 'plain',
}: Readonly<IconButtonProps>) {
  const styles = useStyles(stylesSheet);
  const tone: Tone = disabled ? 'disabled' : variant === 'filled' ? 'onAction' : 'default';

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={4}
      onPress={onPress}
      style={({ pressed }) => styles.button(variant, disabled, pressed)}
    >
      <Icon name={icon} size={22} tone={tone} />
    </Pressable>
  );
}

const stylesSheet = createStyles((theme) => ({
  button: (variant: IconButtonProps['variant'], disabled: boolean, pressed: boolean) => ({
    alignItems: 'center',
    backgroundColor:
      variant === 'filled'
        ? disabled
          ? theme.colors.surfaceMuted
          : theme.colors.action
        : variant === 'outlined'
          ? theme.colors.surface
          : 'transparent',
    borderColor: theme.colors.outline,
    borderRadius: theme.radius.md,
    borderWidth: variant === 'outlined' ? theme.sizes.border : 0,
    height: theme.sizes.iconButton,
    justifyContent: 'center',
    opacity: pressed ? theme.motion.pressedOpacity : 1,
    width: theme.sizes.iconButton,
  }),
}));
