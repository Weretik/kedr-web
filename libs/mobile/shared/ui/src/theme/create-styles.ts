import { useAppTheme, type AppRuntime } from './app-theme';

import type { AppTheme } from './themes';
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';

type Style = ImageStyle | TextStyle | ViewStyle;
/** A style, or a function of component state (pressed, selected…) that returns one. */
type StyleEntry = Style | ((...args: never[]) => Style);
type StyleEntries<TStyles> = { [K in keyof TStyles]: StyleEntry };

type StyleFactory<TStyles> = (theme: AppTheme, rt: AppRuntime) => TStyles;

/** A style sheet built from the theme; read it in a component with `useStyles`. */
export interface AppStyleSheet<TStyles> {
  readonly factory: StyleFactory<TStyles>;
  /** The last styles built, shared by every component that reads this sheet (list rows read it hundreds of times). */
  cache: { key: string; styles: TStyles } | null;
}

export function createStyles<TStyles extends StyleEntries<TStyles>>(
  factory: StyleFactory<TStyles & StyleEntries<TStyles>>,
): AppStyleSheet<TStyles> {
  return { cache: null, factory };
}

/** The sheet's styles for the current theme, width and insets; rebuilt only when one of them changes. */
export function useStyles<TStyles>(sheet: AppStyleSheet<TStyles>): TStyles {
  // The shared cache is written on purpose during render, so React Compiler leaves this one hook alone;
  // the styles it returns change identity only with the key, which keeps the callers' memoization correct.
  'use no memo';
  const { rt, theme } = useAppTheme();
  const { bottom, left, right, top } = rt.insets;
  const key = `${rt.themeName}|${rt.breakpoint}|${top}|${right}|${bottom}|${left}`;
  if (sheet.cache?.key !== key) sheet.cache = { key, styles: sheet.factory(theme, rt) };
  return sheet.cache.styles;
}
