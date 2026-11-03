'use client';

import { Button, cn } from '@site/shared/ui';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

import styles from './theme-toggle.module.css';

const subscribeToHydration = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/** A sun/moon switch; the document theme class also positions it before hydration. */
export function ThemeToggle({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribeToHydration, getClientSnapshot, getServerSnapshot);

  return (
    <Button
      type="button"
      role="switch"
      variant="outline"
      size="sm"
      aria-label={label}
      aria-checked={mounted && resolvedTheme === 'dark'}
      title={label}
      disabled={!mounted}
      className="relative h-8 w-16 shrink-0 rounded-full bg-muted p-0 [@media(pointer:coarse)]:min-h-11"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <span
        aria-hidden
        className={cn(
          styles.thumb,
          'pointer-events-none absolute top-1/2 left-1 size-6 -translate-y-1/2 rounded-full bg-primary dark:translate-x-8',
        )}
      />
      <SunIcon
        aria-hidden
        className="absolute top-1/2 left-2 -translate-y-1/2 text-primary-foreground dark:text-muted-foreground"
        strokeWidth={1.75}
      />
      <MoonIcon
        aria-hidden
        className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground dark:text-primary-foreground"
        strokeWidth={1.75}
      />
    </Button>
  );
}
