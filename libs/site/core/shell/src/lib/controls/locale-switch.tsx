'use client';

import { LOCALES, LOCALE_LANGUAGE_TAGS, switchLocalePath } from '@site/core/i18n';
import { cn } from '@site/shared/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { Locale } from '@site/core/i18n';

const LABELS: Record<Locale, string> = { uk: 'UA', ru: 'RU' };

/** Links to the same page in the other language; plain links, so crawlers can follow them. */
export function LocaleSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() ?? `/${locale}`;

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
