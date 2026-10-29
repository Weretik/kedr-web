'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

import type { ReactNode } from 'react';

/** Light and dark themes through the `dark` class on `<html>`; follows the system until the user picks one. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
