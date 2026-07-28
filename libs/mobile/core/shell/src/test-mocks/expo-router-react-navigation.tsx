import { type ReactNode } from 'react';

export const DefaultTheme = {
  colors: {},
  dark: false,
};

export const DarkTheme = {
  colors: {},
  dark: true,
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  return children;
}
