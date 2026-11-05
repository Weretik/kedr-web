import { fontFaces, type AppTheme } from '@mobile/shared/ui';

import type { Theme } from 'expo-router/react-navigation';

/** Screen backgrounds and stack headers follow the «Офіс» roles. */
export const toNavigationTheme = (theme: AppTheme, dark: boolean): Theme => ({
  colors: {
    background: theme.colors.background,
    border: theme.colors.outlineVariant,
    card: theme.colors.surface,
    notification: theme.colors.status.error.text,
    primary: theme.colors.accentText,
    text: theme.colors.text,
  },
  dark,
  fonts: {
    bold: { fontFamily: fontFaces.bold, fontWeight: '700' },
    heavy: { fontFamily: fontFaces.bold, fontWeight: '700' },
    medium: { fontFamily: fontFaces.medium, fontWeight: '500' },
    regular: { fontFamily: fontFaces.regular, fontWeight: '400' },
  },
});
