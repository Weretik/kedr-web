import { Text, type TextProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { tabularNumbers, type TypeVariant } from '../../theme/typography';
import { toneColor, type Tone } from '../tone';

export interface AppTextProps extends TextProps {
  align?: 'auto' | 'center' | 'left' | 'right';
  /** Prices, quantities, codes and totals. */
  numeric?: boolean;
  tone?: Tone;
  variant?: TypeVariant;
}

/** The only text component of the app: «Офіс» type scale and color roles. */
export function AppText({
  align = 'auto',
  numeric = false,
  style,
  tone = 'default',
  variant = 'body',
  ...props
}: Readonly<AppTextProps>) {
  return (
    <Text
      {...props}
      style={[styles.text(variant, tone, align), numeric && tabularNumbers, style]}
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  text: (variant: TypeVariant, tone: Tone, align: AppTextProps['align']) => ({
    ...theme.type[variant],
    color: toneColor(theme.colors, tone),
    textAlign: align,
  }),
}));
