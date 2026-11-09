import { useState, type Ref } from 'react';
import {
  Pressable,
  TextInput,
  View,
  type TextInputInstance,
  type TextInputProps,
} from 'react-native';

import { useAppTheme } from '../../theme/app-theme';
import { createStyles, useStyles } from '../../theme/create-styles';
import { AppText } from '../text/app-text';
import { Icon, type IconName } from '../text/icon';

export interface TextFieldProps extends Omit<TextInputProps, 'secureTextEntry' | 'style'> {
  error?: string | null;
  inputRef?: Ref<TextInputInstance>;
  label?: string;
  leadingIcon?: IconName;
  /** A password field with a «show» button. */
  secret?: boolean;
}

/** Label above, 48 high, optional leading icon and a show-password action. */
export function TextField({
  accessibilityLabel,
  error,
  inputRef,
  label,
  leadingIcon,
  secret = false,
  ...props
}: Readonly<TextFieldProps>) {
  const styles = useStyles(stylesSheet);
  const { theme } = useAppTheme();
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const hasError = Boolean(error);

  return (
    <View style={styles.container}>
      {label ? (
        <AppText tone="secondary" variant="caption">
          {label}
        </AppText>
      ) : null}
      <View style={styles.field(focused, hasError)}>
        {leadingIcon ? <Icon name={leadingIcon} size={20} tone="secondary" /> : null}
        <TextInput
          {...props}
          accessibilityLabel={accessibilityLabel ?? label}
          onBlur={(event) => {
            setFocused(false);
            props.onBlur?.(event);
          }}
          onFocus={(event) => {
            setFocused(true);
            props.onFocus?.(event);
          }}
          placeholderTextColor={theme.colors.textDisabled}
          ref={inputRef}
          secureTextEntry={secret && !revealed}
          selectionColor={theme.colors.brand}
          style={styles.input}
        />
        {secret ? (
          <Pressable
            accessibilityLabel={revealed ? 'Сховати пароль' : 'Показати пароль'}
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => setRevealed((value) => !value)}
            style={styles.action}
          >
            <Icon name={revealed ? 'eye-off-outline' : 'eye-outline'} size={20} tone="secondary" />
          </Pressable>
        ) : null}
      </View>
      {hasError ? (
        <AppText accessibilityLiveRegion="polite" tone="error" variant="secondary">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const stylesSheet = createStyles((theme) => ({
  action: {
    alignItems: 'center',
    height: theme.sizes.touch,
    justifyContent: 'center',
    width: theme.sizes.touch,
  },
  container: { gap: theme.space.xs },
  field: (focused: boolean, hasError: boolean) => ({
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: hasError
      ? theme.colors.status.error.text
      : focused
        ? theme.colors.brand
        : theme.colors.outline,
    borderRadius: theme.radius.md,
    borderWidth: focused || hasError ? 2 : theme.sizes.border,
    flexDirection: 'row',
    gap: theme.space.sm,
    minHeight: theme.sizes.field,
    paddingLeft: theme.space.md,
  }),
  input: {
    ...theme.type.body,
    color: theme.colors.text,
    flex: 1,
    minHeight: theme.sizes.field - 4,
    paddingRight: theme.space.md,
    paddingVertical: 0,
  },
}));
