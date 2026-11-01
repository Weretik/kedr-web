import { localizedPath } from '@site/core/i18n';
import Link from 'next/link';

import { SHELL_PATHS } from '../../navigation/site-navigation';
import { CompactActions } from '../compact-actions';
import { RegionsMenu } from '../menus/regions-menu';

import type { ShellDictionary } from '../../i18n/shell-dictionary';
import type { ShellLink } from '../../navigation/catalog-navigation';
import type { Locale } from '@site/core/i18n';

/** Third header row (desktop): catalog sections, regions, cooperation, and the compact search and cart. */
export function CategoryBar({
  locale,
  dictionary,
  links,
}: {
  locale: Locale;
  dictionary: ShellDictionary;
  links: readonly ShellLink[];
}) {
  return (
    <div className="hidden border-t border-border md:block">
      <nav
        aria-label={dictionary.categoriesNav}
        className="relative mx-auto flex h-11 max-w-[90rem] items-center gap-1 px-4 text-sm lg:px-6"
      >
        {links.map((link) => (
          <Link
            key={link.key}
            href={localizedPath(locale, link.path)}
            className="rounded-md px-2 py-1.5 hover:bg-muted"
          >
            {link.label}
          </Link>
        ))}
        <div className="ml-auto flex items-center gap-1">
          <RegionsMenu locale={locale} dictionary={dictionary} />
          <Link
            href={localizedPath(locale, SHELL_PATHS.wholesale)}
            className="rounded-md px-2 py-1.5 font-medium text-brand-text hover:bg-muted"
          >
            {dictionary.wholesale}
          </Link>
          <CompactActions locale={locale} dictionary={dictionary} />
        </div>
      </nav>
    </div>
  );
}
