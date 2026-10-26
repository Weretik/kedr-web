import { Pressable, StyleSheet } from 'react-native';
import { Icon } from 'react-native-paper';

import { useKedrTheme } from '../../theme/kedr-theme';

export interface RoundIconButtonProps {
  accessibilityLabel: string;
  disabled?: boolean;
  icon: string;
  onPress: () => void;
  testID?: string;
  /** `surface` on screen grounds, `onPrimary` on the green hero or stage, `inverse` on dark bars. */
  tone?: 'inverse' | 'onPrimary' | 'surface';
}

export function RoundIconButton({
  accessibilityLabel,
  disabled,
  icon,
  onPress,
  testID,
  tone = 'surface',
}: Readonly<RoundIconButtonProps>) {
  const { kedr } = useKedrTheme();
  const palette = {
    inverse: { background: kedr.colors.inverseSurface, foreground: kedr.colors.inverseOnSurface },
    onPrimary: { background: 'rgba(255,255,255,0.22)', foreground: kedr.colors.onPrimary },
    surface: { background: kedr.colors.surface, foreground: kedr.colors.onSurface },
  }[tone];

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={4}
      onPress={onPress}
      style={[styles.button, { backgroundColor: palette.background, opacity: disabled ? 0.4 : 1 }]}
      testID={testID}
    >
      <Icon color={palette.foreground} size={20} source={icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 21,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
});
