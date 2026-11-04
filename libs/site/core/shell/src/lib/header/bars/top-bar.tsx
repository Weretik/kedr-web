import { localizedPath } from '@site/core/i18n';
import { MapPinIcon } from 'lucide-react';
import Link from 'next/link';

import { LocaleSwitch } from '../../controls/locale-switch';
import { ThemeToggle } from '../../controls/theme-toggle';
import { INFO_LINKS } from '../../navigation/site-navigation';

import type { ShellDictionary } from '../../i18n/shell-dictionary';
import type { CompanyContacts } from '@site/core/config';
import type { Locale } from '@site/core/i18n';

/** First header row (desktop): city, information pages, language, and theme. */
export function TopBar({
  locale,
  dictionary,
  contacts,
}: {
  locale: Locale;
  dictionary: ShellDictionary;
  contacts: CompanyContacts;
}) {
  return (
    <div className="hidden border-b border-border bg-muted/60 md:block">
      <div className="mx-auto grid min-h-10 max-w-[90rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 px-4 py-1 text-xs text-muted-foreground lg:px-6 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:py-0">
        <span className="col-start-1 row-start-1 flex items-center gap-1.5 whitespace-nowrap">
          <MapPinIcon aria-hidden className="size-3.5 shrink-0" strokeWidth={1.75} />
          {dictionary.cityPrefix} {contacts.city[locale]}
        </span>
        <nav
          aria-label={dictionary.infoNav}
          className="col-span-2 row-start-2 flex min-h-8 flex-wrap items-center justify-center gap-x-4 gap-y-2 py-1 xl:col-span-1 xl:col-start-2 xl:row-start-1 xl:min-h-10 xl:py-0"
        >
          {INFO_LINKS.map((link) => (
            <Link
              key={link.key}
              href={{ pathname: localizedPath(locale, link.path), hash: link.hash }}
              className="whitespace-nowrap hover:text-foreground"
            >
              {dictionary.links[link.key]}
            </Link>
          ))}
        </nav>
        <div className="col-start-2 row-start-1 flex items-center justify-self-end gap-3 xl:col-start-3">
          <LocaleSwitch locale={locale} label={dictionary.languageSwitch} />
          <div className="border-l border-border pl-3">
            <ThemeToggle label={dictionary.toggleTheme} />
          </div>
        </div>
      </div>
    </div>
  );
}
