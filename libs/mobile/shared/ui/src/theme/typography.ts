import type { TextStyle } from 'react-native';

/** Golos Text faces registered with `expo-font` in the app root layout. */
export const fontFaces = {
  bold: 'GolosText_700Bold',
  medium: 'GolosText_500Medium',
  regular: 'GolosText_400Regular',
  semiBold: 'GolosText_600SemiBold',
} as const;

type TypeStyle = Required<Pick<TextStyle, 'fontFamily' | 'fontSize' | 'lineHeight'>>;

const style = (fontFamily: string, fontSize: number, lineHeight: number): TypeStyle => ({
  fontFamily,
  fontSize,
  lineHeight,
});

/** Type scale of «Офіс». Names describe the use, not the size. */
export const typeScale = {
  body: style(fontFaces.regular, 15, 20),
  bodyStrong: style(fontFaces.semiBold, 15, 20),
  button: style(fontFaces.semiBold, 15, 20),
  caption: style(fontFaces.medium, 12, 16),
  loginTitle: style(fontFaces.bold, 30, 36),
  price: style(fontFaces.bold, 16, 22),
  screenTitle: style(fontFaces.bold, 26, 32),
  secondary: style(fontFaces.regular, 13, 18),
  sectionTitle: style(fontFaces.bold, 20, 26),
  tabLabel: style(fontFaces.medium, 11, 14),
  total: style(fontFaces.bold, 24, 30),
} as const;

export type TypeVariant = keyof typeof typeScale;

/** Prices, quantities, codes and totals line up in columns. */
export const tabularNumbers: TextStyle = { fontVariant: ['tabular-nums'] };
