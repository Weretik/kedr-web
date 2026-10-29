import { localizedPath } from '@site/core/i18n';
import { MapPinIcon } from 'lucide-react';
import Link from 'next/link';

import { LocaleSwitch } from '../../controls/locale-switch';
import { ThemeToggle } from '../../controls/theme-toggle';
import { INFO_LINKS } from '../../navigation/site-navigation';

import type { ShellDictionary } from '../../i18n/shell-dictionary';
import type { Locale } from '@site/core/i18n';

/** First header row (desktop): city, information pages, language, and theme. */
export function TopBar({ locale, dictionary }: { locale: Locale; dictionary: ShellDictionary }) {
  return (
    <div className="hidden border-b border-border bg-muted/60 md:block">
      <div className="mx-auto flex h-10 max-w-7xl items-center gap-6 px-4 text-xs text-muted-foreground lg:px-6">
        <span className="flex items-center gap-1.5">
          <MapPinIcon className="size-3.5" strokeWidth={1.75} />
          {dictionary.city}
        </span>
        <nav aria-label={dictionary.infoNav} className="flex flex-1 items-center gap-4">
          {INFO_LINKS.map((link) => (
            <Link
              key={link.key}
              href={localizedPath(locale, link.path)}
              className="hover:text-foreground"
            >
              {dictionary.links[link.key]}
            </Link>
          ))}
        </nav>
        <LocaleSwitch locale={locale} label={dictionary.languageSwitch} />
        <ThemeToggle label={dictionary.toggleTheme} />
      </div>
    </div>
  );
}
