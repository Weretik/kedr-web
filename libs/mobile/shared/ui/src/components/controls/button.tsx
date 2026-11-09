import { ActivityIndicator, Pressable, View } from 'react-native';

import { useAppTheme } from '../../theme/app-theme';
import { createStyles, useStyles } from '../../theme/create-styles';
import { AppText } from '../text/app-text';
import { Icon, type IconName } from '../text/icon';
import { toneColor, type Tone } from '../tone';

export type ButtonVariant = 'destructive' | 'filled' | 'outlined' | 'text';

export interface ButtonProps {
  accessibilityHint?: string;
  disabled?: boolean;
  icon?: IconName;
  label: string;
  loading?: boolean;
  onPress: () => void;
  variant?: ButtonVariant;
}

const labelTone: Record<ButtonVariant, Tone> = {
  destructive: 'error',
  filled: 'onAction',
  outlined: 'default',
  text: 'accent',
};

/** 48 dp button. One `filled` button per screen area; the second action is `outlined`. */
export function Button({
  accessibilityHint,
  disabled = false,
  icon,
  label,
  loading = false,
  onPress,
  variant = 'filled',
}: Readonly<ButtonProps>) {
  const styles = useStyles(stylesSheet);
  const { theme } = useAppTheme();
  const inactive = disabled || loading;
  const tone: Tone = inactive && variant !== 'filled' ? 'disabled' : labelTone[variant];

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: inactive }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => styles.button(variant, inactive, pressed)}
    >
      {loading ? (
        <ActivityIndicator color={toneColor(theme.colors, tone)} />
      ) : (
        <View style={styles.content}>
          {icon ? <Icon name={icon} size={20} tone={tone} /> : null}
          <AppText numberOfLines={1} tone={tone} variant="button">
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const stylesSheet = createStyles((theme) => ({
  button: (variant: ButtonVariant, inactive: boolean, pressed: boolean) => ({
    alignItems: 'center',
    backgroundColor:
      variant === 'filled'
        ? inactive
          ? theme.colors.textDisabled
          : theme.colors.action
        : variant === 'outlined'
          ? theme.colors.surface
          : 'transparent',
    borderColor: variant === 'outlined' ? theme.colors.outline : 'transparent',
    borderRadius: theme.radius.md,
    borderWidth: variant === 'outlined' ? theme.sizes.border : 0,
    justifyContent: 'center',
    minHeight: theme.sizes.button,
    opacity: pressed ? theme.motion.pressedOpacity : 1,
    paddingHorizontal: theme.space.lg,
  }),
  content: { alignItems: 'center', flexDirection: 'row', gap: theme.space.sm },
}));
