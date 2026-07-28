import { createContext, useContext, type ReactNode } from 'react';
import { Text as NativeText, View } from 'react-native';

const ThemeContext = createContext({ dark: false });

export const MD3LightTheme = { dark: false, colors: {} };
export const MD3DarkTheme = { dark: true, colors: {} };

export function PaperProvider({
  children,
  theme,
}: {
  children: ReactNode;
  theme: { dark: boolean };
}) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function Snackbar({ children }: { children: ReactNode }) {
  return <View>{children}</View>;
}

export const Text = NativeText;
