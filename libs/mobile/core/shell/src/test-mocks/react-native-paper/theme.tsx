import { createContext, useContext, type ReactNode } from 'react';

const colors = {
  errorContainer: '#ffdad6', onErrorContainer: '#410002',
  onPrimaryContainer: '#001e2f', onSecondaryContainer: '#111c2b',
  primaryContainer: '#c9e6ff', secondaryContainer: '#d8e3f8',
};
const ThemeContext = createContext({ colors, dark: false });

export const MD3LightTheme = { dark: false, colors };
export const MD3DarkTheme = { dark: true, colors };

export function PaperProvider({
  children,
  theme,
}: {
  children: ReactNode;
  theme: { colors?: typeof colors; dark: boolean };
}) {
  return <ThemeContext.Provider value={{ colors: theme.colors ?? colors, dark: theme.dark }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
