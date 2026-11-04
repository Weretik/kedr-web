'use client';

import { localizedPath } from '@site/core/i18n';
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@site/shared/ui';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

import { CopyPhoneButton } from '../../controls/copy-phone-button';
import { LocaleSwitch } from '../../controls/locale-switch';
import { ThemeToggle } from '../../controls/theme-toggle';
import { INFO_LINKS, SHELL_PATHS } from '../../navigation/site-navigation';

import type { ShellDictionary } from '../../i18n/shell-dictionary';
import type { ShellLink } from '../../navigation/catalog-navigation';
import type { CompanyContacts } from '@site/core/config';
import type { Locale } from '@site/core/i18n';

type MobileMenuProps = {
  locale: Locale;
  dictionary: ShellDictionary;
  contacts: CompanyContacts;
  categoryLinks: readonly ShellLink[];
};

/** Phone and tablet menu in a side sheet: catalog sections, information pages, contacts, language, and theme. */
export function MobileMenu({ locale, dictionary, contacts, categoryLinks }: MobileMenuProps) {
  const item = (key: string, path: string, label: string, hash?: string) => (
    <li key={key}>
      <SheetClose asChild>
        <Link
          href={{ pathname: localizedPath(locale, path), hash }}
          className="block rounded-md px-2 py-2 text-sm hover:bg-muted"
        >
          {label}
        </Link>
      </SheetClose>
    </li>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label={dictionary.openMenu}>
          <MenuIcon strokeWidth={1.75} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" closeLabel={dictionary.closeMenu}>
        <SheetTitle>{dictionary.menuTitle}</SheetTitle>
        <SheetDescription>
          {dictionary.cityPrefix} {contacts.city[locale]}
        </SheetDescription>
        <ul>
          {item('catalog', SHELL_PATHS.catalog, dictionary.allCategories)}
          {categoryLinks.map((link) => item(link.key, link.path, link.label))}
          {item('wholesale', SHELL_PATHS.wholesale, dictionary.wholesale)}
        </ul>
        <ul className="border-t border-border pt-3">
          {INFO_LINKS.map((link) =>
            item(link.key, link.path, dictionary.links[link.key], link.hash),
          )}
        </ul>
        <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <CopyPhoneButton
            phone={contacts.phone}
            copyLabel={dictionary.copyPhone}
            copiedLabel={dictionary.phoneCopied}
          />
          <LocaleSwitch locale={locale} label={dictionary.languageSwitch} />
          <ThemeToggle label={dictionary.toggleTheme} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
