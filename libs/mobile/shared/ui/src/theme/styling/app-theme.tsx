import { createContext, use, useMemo, type ReactNode } from 'react';
import { useWindowDimensions } from 'react-native';
import { SafeAreaInsetsContext, type EdgeInsets } from 'react-native-safe-area-context';

import { breakpointFor, type Breakpoint } from '../tokens/breakpoints';
import { darkTheme, lightTheme, type AppTheme, type ThemeName } from '../tokens/themes';

/** What a style sheet can depend on besides the theme. */
export interface AppRuntime {
  breakpoint: Breakpoint;
  insets: EdgeInsets;
  themeName: ThemeName;
}

export interface AppThemeValue {
  rt: AppRuntime;
  theme: AppTheme;
}

const themes: Record<ThemeName, AppTheme> = { dark: darkTheme, light: lightTheme };
const noInsets: EdgeInsets = { bottom: 0, left: 0, right: 0, top: 0 };

const ThemeNameContext = createContext<ThemeName>('light');

/** The chosen theme for everything below; a change re-renders the screens through React, nothing native. */
export function AppThemeProvider({
  children,
  themeName,
}: Readonly<{ children: ReactNode; themeName: ThemeName }>) {
  return <ThemeNameContext value={themeName}>{children}</ThemeNameContext>;
}

/** The current theme tokens with the safe-area insets and the width class. */
export function useAppTheme(): AppThemeValue {
  const themeName = use(ThemeNameContext);
  const insets = use(SafeAreaInsetsContext) ?? noInsets;
  const breakpoint = breakpointFor(useWindowDimensions().width);
  const { bottom, left, right, top } = insets;

  return useMemo(
    () => ({
      rt: { breakpoint, insets: { bottom, left, right, top }, themeName },
      theme: themes[themeName],
    }),
    [breakpoint, bottom, left, right, themeName, top],
  );
}
