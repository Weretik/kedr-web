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
import { CATEGORY_LINKS, INFO_LINKS, SHELL_PATHS } from '../../navigation/site-navigation';

import type { ShellDictionary } from '../../i18n/shell-dictionary';
import type { Locale } from '@site/core/i18n';

type MobileMenuProps = {
  locale: Locale;
  dictionary: ShellDictionary;
  phone: { display: string; e164: string };
};

/** Phone and tablet menu in a side sheet: catalog sections, information pages, contacts, language, and theme. */
export function MobileMenu({ locale, dictionary, phone }: MobileMenuProps) {
  const item = (key: string, path: string, label: string) => (
    <li key={key}>
      <SheetClose asChild>
        <Link
          href={localizedPath(locale, path)}
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
        <SheetDescription>{dictionary.city}</SheetDescription>
        <ul>
          {CATEGORY_LINKS.map((link) => item(link.key, link.path, dictionary.categories[link.key]))}
          {item('wholesale', SHELL_PATHS.wholesale, dictionary.wholesale)}
        </ul>
        <ul className="border-t border-border pt-3">
          {INFO_LINKS.map((link) => item(link.key, link.path, dictionary.links[link.key]))}
        </ul>
        <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <CopyPhoneButton
            phone={phone}
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
