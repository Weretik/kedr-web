import { localizedPath } from '@site/core/i18n';
import { Button } from '@site/shared/ui';
import { PhoneIcon, ShoppingCartIcon } from 'lucide-react';
import Link from 'next/link';

import { SHELL_PATHS } from '../../navigation/site-navigation';

import type { ShellDictionary } from '../../i18n/shell-dictionary';
import type { CompanyContacts } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { ReactNode } from 'react';

/**
 * Call and cart entry points. The call button replaces the copy-phone control below the wide layout; the cart
 * feature adds the item count and the total as a small client island.
 */
export function HeaderActions({
  locale,
  dictionary,
  phone,
  cartAction,
}: {
  locale: Locale;
  dictionary: ShellDictionary;
  phone: CompanyContacts['phone'];
  cartAction?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-1">
      <Button asChild variant="ghost" size="icon" className="size-10 xl:hidden">
        <a href={`tel:${phone.e164}`} aria-label={`${dictionary.call} ${phone.display}`}>
          <PhoneIcon strokeWidth={1.75} />
        </a>
      </Button>
      {cartAction ?? (
        <Button asChild variant="outline" size="sm" className="h-10 px-2 sm:px-3">
          <Link
            href={localizedPath(locale, SHELL_PATHS.cart)}
            rel="nofollow"
            aria-label={dictionary.cart}
          >
            <ShoppingCartIcon strokeWidth={1.75} />
            <span className="hidden sm:inline">{dictionary.cart}</span>
          </Link>
        </Button>
      )}
    </div>
  );
}
