import { localizedPath } from '@site/core/i18n';
import { isValidProductSlug, productPath } from '@site/product/model';

import type { CartClientStore, CartSnapshot } from '../state/cart-client-store';
import type { BasketProps } from '@site/cart/ui';
import type { Locale } from '@site/core/i18n';

/** Map the single owner to presentation props; UI has no store or transport imports. */
export function cartViewProps(
  locale: Locale,
  snapshot: CartSnapshot,
  store: CartClientStore | null,
): BasketProps {
  return {
    locale,
    lines: snapshot.lines.map((line) => ({
      ...line,
      productHref: isValidProductSlug(line.snapshot.slug)
        ? localizedPath(locale, productPath(line.snapshot.slug))
        : null,
    })),
    restoring: !snapshot.hydrated,
    pending: snapshot.pending,
    recovery: snapshot.recoveryRequired ? { discardedCount: snapshot.discardedCount } : null,
    storageIssue: snapshot.storageIssue,
    notice: snapshot.notice,
    onChangeQuantity: (id, quantity) => {
      store?.setQuantity(id, quantity);
    },
    onRemove: (id) => {
      store?.remove(id);
    },
    onAcceptRecovery: () => {
      store?.acceptRecovery();
    },
    onDiscardRecovery: () => {
      store?.discardRecovery();
    },
  };
}
