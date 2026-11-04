import { COMPANY } from '@site/core/config';
import { localizedPath } from '@site/core/i18n';
import Image from 'next/image';
import Link from 'next/link';

import { CopyPhoneButton } from '../../controls/copy-phone-button';
import { MessengerLinks } from '../../controls/messenger-links';
import { HeaderActions } from '../header-actions';
import { HeaderSearch } from '../header-search';
import { CatalogMenu } from '../menus/catalog-menu';
import { MobileMenu } from '../menus/mobile-menu';

import type { ShellDictionary } from '../../i18n/shell-dictionary';
import type { ShellLink } from '../../navigation/catalog-navigation';
import type { Locale } from '@site/core/i18n';
import type { ReactNode } from 'react';

type MainBarProps = {
  locale: Locale;
  dictionary: ShellDictionary;
  categoryLinks: readonly ShellLink[];
  /** Mega menu from the catalog domain; the fallback dropdown is used without it. */
  catalogMenu?: ReactNode;
  cartAction?: ReactNode;
};

/** Second header row: logo, catalog, search, phone with messengers, cabinet, and cart. */
export function MainBar({
  locale,
  dictionary,
  categoryLinks,
  catalogMenu,
  cartAction,
}: MainBarProps) {
  return (
    <div className="mx-auto flex max-w-[90rem] flex-wrap items-center gap-3 px-4 py-3 lg:flex-nowrap lg:gap-5 lg:px-6">
      <MobileMenu
        locale={locale}
        dictionary={dictionary}
        phone={COMPANY.phone}
        categoryLinks={categoryLinks}
      />
      <Link href={localizedPath(locale)} aria-label={dictionary.homeAria} className="shrink-0">
        <Image
          src="/assets/logo/main-logo.svg"
          alt={dictionary.logoAlt}
          width={84}
          height={46}
          priority
        />
      </Link>
      <div className="hidden md:block">
        {catalogMenu ?? (
          <CatalogMenu locale={locale} dictionary={dictionary} links={categoryLinks} />
        )}
      </div>
      <HeaderSearch
        locale={locale}
        dictionary={dictionary}
        className="order-last w-full lg:order-none lg:flex-1"
      />
      <div className="hidden items-center gap-2 xl:flex">
        <CopyPhoneButton
          phone={COMPANY.phone}
          copyLabel={dictionary.copyPhone}
          copiedLabel={dictionary.phoneCopied}
        />
        <MessengerLinks dictionary={dictionary} />
      </div>
      <div className="ml-auto lg:ml-0">
        <HeaderActions locale={locale} dictionary={dictionary} cartAction={cartAction} />
      </div>
    </div>
  );
}
