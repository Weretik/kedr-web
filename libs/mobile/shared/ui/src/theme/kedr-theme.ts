import { useMemo } from 'react';
import { useTheme, type MD3Theme } from 'react-native-paper';

import { kedrMotion } from './motion';
import { kedrDarkColors, kedrLightColors, type KedrColors } from './palette';
import { kedrLayout, kedrRadius, kedrSpace } from './shape';
import { kedrDisplayType, kedrFontFamilies } from './typography';

export interface KedrTokens {
  colors: KedrColors;
  fonts: typeof kedrFontFamilies;
  layout: typeof kedrLayout;
  motion: typeof kedrMotion;
  radius: typeof kedrRadius;
  space: typeof kedrSpace;
  type: typeof kedrDisplayType;
}

export type KedrTheme = MD3Theme & { kedr: KedrTokens };

const lightTokens: KedrTokens = {
  colors: kedrLightColors,
  fonts: kedrFontFamilies,
  layout: kedrLayout,
  motion: kedrMotion,
  radius: kedrRadius,
  space: kedrSpace,
  type: kedrDisplayType,
};

const darkTokens: KedrTokens = { ...lightTokens, colors: kedrDarkColors };

export function createKedrTokens(dark: boolean): KedrTokens {
  return dark ? darkTokens : lightTokens;
}

/** Paper theme plus Kedr tokens. Falls back to default tokens when the provider has none (tests). */
export function useKedrTheme(): KedrTheme {
  const theme = useTheme() as MD3Theme & { kedr?: KedrTokens };
  return useMemo(
    () =>
      theme.kedr ? (theme as KedrTheme) : { ...theme, kedr: createKedrTokens(Boolean(theme.dark)) },
    [theme],
  );
}
