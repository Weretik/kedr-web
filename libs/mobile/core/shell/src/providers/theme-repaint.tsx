import { type ThemeName } from '@mobile/shared/ui';
import { usePathname, useRouter } from 'expo-router';
import { Fragment, useEffect, useRef, type ReactNode } from 'react';

import { applyUnistylesTheme } from '../theme/use-theme-name';

/**
 * Mounts the screens again when the theme changes, so every view takes the new colors: on a device Unistyles does
 * not repaint views that stay mounted (hidden tabs, memoized rows). The open screen is reopened afterwards.
 */
export function ThemeRepaint({
  children,
  themeName,
}: Readonly<{ children: ReactNode; themeName: ThemeName }>) {
  const pathname = usePathname();
  const router = useRouter();
  const shown = useRef({ pathname, themeName });

  // Before the screens below render, so they read the new theme.
  applyUnistylesTheme(themeName);

  useEffect(() => {
    const before = shown.current;
    shown.current = { pathname, themeName };
    if (before.themeName === themeName) return;
    // The new navigator mounts first; then the screen that was open comes back.
    const timer = setTimeout(() => router.replace(before.pathname as never), 0);
    return () => clearTimeout(timer);
  }, [pathname, router, themeName]);

  return <Fragment key={themeName}>{children}</Fragment>;
}
