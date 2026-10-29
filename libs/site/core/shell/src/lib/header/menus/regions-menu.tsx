import { localizedPath } from '@site/core/i18n';
import Link from 'next/link';

import { DropdownMenu } from './dropdown-menu';
import { REGION_SLUGS, regionPath } from '../../navigation/site-navigation';

import type { ShellDictionary } from '../../i18n/shell-dictionary';
import type { Locale } from '@site/core/i18n';

/** "Регіони" dropdown with links to all regional landing pages. */
export function RegionsMenu({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: ShellDictionary;
}) {
  return (
    <DropdownMenu
      label={dictionary.regions}
      triggerClassName="px-2 py-1.5 hover:bg-muted"
      panelClassName="right-0 left-auto w-[min(36rem,calc(100vw-2rem))]"
    >
      <ul className="grid gap-0.5 sm:grid-cols-2">
        {REGION_SLUGS.map((slug) => (
          <li key={slug}>
            <Link
              href={localizedPath(locale, regionPath(slug))}
              className="block rounded-md px-3 py-1.5 text-sm hover:bg-muted"
            >
              {dictionary.regionNames[slug]}
            </Link>
          </li>
        ))}
      </ul>
    </DropdownMenu>
  );
}
