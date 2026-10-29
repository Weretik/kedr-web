import { localizedPath } from '@site/core/i18n';
import { LayoutGridIcon } from 'lucide-react';
import Link from 'next/link';

import { DropdownMenu } from './dropdown-menu';
import { CATEGORY_LINKS, SHELL_PATHS } from '../../navigation/site-navigation';

import type { ShellDictionary } from '../../i18n/shell-dictionary';
import type { Locale } from '@site/core/i18n';

type CatalogMenuProps = { locale: Locale; dictionary: ShellDictionary };

/** "Каталог" button: catalog sections and the wholesale block. Subcategories and door brands come with the catalog. */
export function CatalogMenu({ locale, dictionary }: CatalogMenuProps) {
  return (
    <DropdownMenu
      label={
        <>
          <LayoutGridIcon className="size-4" strokeWidth={1.75} />
          {dictionary.catalog}
        </>
      }
      triggerClassName="h-10 bg-brand px-4 text-brand-foreground hover:bg-brand/90"
      panelClassName="grid w-[min(40rem,calc(100vw-2rem))] gap-3 sm:grid-cols-[1fr_14rem]"
    >
      <ul className="grid gap-1 sm:grid-cols-2">
        {CATEGORY_LINKS.map((link) => (
          <li key={link.key}>
            <Link
              href={localizedPath(locale, link.path)}
              className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
              {dictionary.categories[link.key]}
            </Link>
          </li>
        ))}
        <li className="sm:col-span-2">
          <Link
            href={localizedPath(locale, SHELL_PATHS.catalog)}
            className="block rounded-md px-3 py-2 text-sm font-medium underline-offset-4 hover:underline"
          >
            {dictionary.allCategories}
          </Link>
        </li>
      </ul>
      <Link
        href={localizedPath(locale, SHELL_PATHS.wholesale)}
        className="flex flex-col justify-end gap-1 rounded-lg bg-primary p-4 text-primary-foreground"
      >
        <span className="text-sm font-semibold">{dictionary.wholesale}</span>
        <span className="text-xs opacity-80">{dictionary.wholesaleNote}</span>
      </Link>
    </DropdownMenu>
  );
}
