'use client';

import { LOCALES, LOCALE_LANGUAGE_TAGS, localizedPath, switchLocalePath } from '@site/core/i18n';
import { cn } from '@site/shared/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SHELL_PATHS } from '../navigation/site-navigation';

import type { Locale } from '@site/core/i18n';

const LABELS: Record<Locale, string> = { uk: 'UA', ru: 'RU' };

/** Locale links retain the route; private checkout destinations remain nofollow. */
export function LocaleSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() ?? `/${locale}`;
  const checkout = LOCALES.some(
    (supported) => pathname.replace(/\/+$/, '') === localizedPath(supported, SHELL_PATHS.cart),
  );

  return (
    <nav
      aria-label={label}
      className="flex items-center rounded-md border border-border p-0.5 text-xs font-medium"
    >
      {LOCALES.map((target) => (
        <Link
          key={target}
          href={switchLocalePath(pathname, target)}
          hrefLang={LOCALE_LANGUAGE_TAGS[target]}
          rel={checkout ? 'nofollow' : undefined}
          aria-current={target === locale ? 'true' : undefined}
          className={cn(
            'rounded px-2 py-1 transition-colors',
            target === locale
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {LABELS[target]}
        </Link>
      ))}
    </nav>
  );
}
