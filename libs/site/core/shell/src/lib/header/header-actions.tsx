import { localizedPath } from '@site/core/i18n';
import { Button } from '@site/shared/ui';
import { ShoppingCartIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';

import { SHELL_PATHS } from '../navigation/site-navigation';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { Locale } from '@site/core/i18n';

/**
 * Cabinet and cart entry points. They are plain links in the shell; the account and cart features add the session
 * state, the item count, and the total as small client islands.
 */
export function HeaderActions({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: ShellDictionary;
}) {
  return (
    <div className="flex items-center gap-1">
      <Button asChild variant="ghost" size="sm" className="h-10 px-2 sm:px-3">
        <Link
          href={localizedPath(locale, SHELL_PATHS.cabinet)}
          rel="nofollow"
          aria-label={dictionary.cabinet}
        >
          <UserIcon strokeWidth={1.75} />
          <span className="hidden sm:inline">{dictionary.cabinet}</span>
        </Link>
      </Button>
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
    </div>
  );
}
