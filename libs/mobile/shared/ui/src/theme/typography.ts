import type { TextStyle } from 'react-native';

/** Font family names registered by the app with `expo-font` (see apps/mobile/src/app/_layout.tsx). */
export const kedrFontFamilies = {
  display: 'Unbounded_600SemiBold',
  displayMedium: 'Unbounded_500Medium',
  textBold: 'GolosText_700Bold',
  textMedium: 'GolosText_500Medium',
  textRegular: 'GolosText_400Regular',
  textSemiBold: 'GolosText_600SemiBold',
} as const;

type TypeStyle = Pick<TextStyle, 'fontFamily' | 'fontSize' | 'letterSpacing' | 'lineHeight'>;

const display = (fontSize: number, lineHeight: number): TypeStyle => ({
  fontFamily: kedrFontFamilies.display,
  fontSize,
  letterSpacing: -0.2,
  lineHeight,
});

/** Display styles that Paper variants do not cover: prices, totals, metrics. */
export const kedrDisplayType = {
  hero: display(22, 28),
  metric: display(22, 28),
  price: display(13, 18),
  priceLarge: display(18, 24),
  productTitle: display(16, 22),
  screenTitle: display(20, 26),
  total: display(30, 36),
} as const;

const text = (fontFamily: string, fontSize: number, lineHeight: number, letterSpacing = 0) => ({
  fontFamily,
  fontSize,
  fontWeight: '400' as const,
  letterSpacing,
  lineHeight,
});

/** Paper MD3 variant config passed to `configureFonts({ config })`. */
export const kedrPaperFontConfig = {
  bodyLarge: text(kedrFontFamilies.textRegular, 16, 22),
  bodyMedium: text(kedrFontFamilies.textRegular, 14, 20),
  bodySmall: text(kedrFontFamilies.textRegular, 12.5, 17),
  default: text(kedrFontFamilies.textRegular, 14, 20),
  displayLarge: text(kedrFontFamilies.display, 40, 48, -0.4),
  displayMedium: text(kedrFontFamilies.display, 34, 42, -0.3),
  displaySmall: text(kedrFontFamilies.display, 30, 36, -0.2),
  headlineLarge: text(kedrFontFamilies.display, 26, 32, -0.2),
  headlineMedium: text(kedrFontFamilies.display, 24, 30, -0.2),
  headlineSmall: text(kedrFontFamilies.display, 22, 28, -0.2),
  labelLarge: text(kedrFontFamilies.textSemiBold, 14, 20),
  labelMedium: text(kedrFontFamilies.textSemiBold, 13, 18),
  labelSmall: text(kedrFontFamilies.textMedium, 11.5, 16),
  titleLarge: text(kedrFontFamilies.display, 20, 26, -0.2),
  titleMedium: text(kedrFontFamilies.display, 16, 22),
  titleSmall: text(kedrFontFamilies.textSemiBold, 14, 20),
};

export const tabularNumbers: TextStyle = { fontVariant: ['tabular-nums'] };
