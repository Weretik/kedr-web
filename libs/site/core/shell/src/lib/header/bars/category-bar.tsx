import { localizedPath } from '@site/core/i18n';
import Link from 'next/link';

import { CATEGORY_LINKS, SHELL_PATHS } from '../../navigation/site-navigation';
import { RegionsMenu } from '../menus/regions-menu';

import type { ShellDictionary } from '../../i18n/shell-dictionary';
import type { Locale } from '@site/core/i18n';

/** Third header row (desktop): catalog sections, regions, and cooperation. */
export function CategoryBar({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: ShellDictionary;
}) {
  return (
    <div className="hidden border-t border-border md:block">
      <nav
        aria-label={dictionary.categoriesNav}
        className="mx-auto flex h-11 max-w-7xl items-center gap-1 px-4 text-sm lg:px-6"
      >
        {CATEGORY_LINKS.map((link) => (
          <Link
            key={link.key}
            href={localizedPath(locale, link.path)}
            className="rounded-md px-2 py-1.5 hover:bg-muted"
          >
            {dictionary.categories[link.key]}
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
        </div>
      </nav>
    </div>
  );
}
