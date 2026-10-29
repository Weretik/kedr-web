'use client';

import { Button } from '@site/shared/ui';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      title={label}
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <SunIcon className="dark:hidden" strokeWidth={1.75} />
      <MoonIcon className="hidden dark:block" strokeWidth={1.75} />
    </Button>
  );
}
