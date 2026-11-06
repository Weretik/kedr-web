import { getCartCopy } from './cart-copy';

import type { CheckoutField } from '@site/cart/model';
import type { Locale } from '@site/core/i18n';

export function fieldMessage(locale: Locale, field: CheckoutField, code: string): string {
  const copy = getCartCopy(locale);
  if (code === 'required') return field === 'firstName' ? copy.nameRequired : copy.phoneRequired;
  if (code === 'too-long') return field === 'firstName' ? copy.nameLength : copy.phoneTooLong;
  if (code === 'too-short') return field === 'firstName' ? copy.nameLength : copy.phoneInvalid;
  return code === 'invalid-phone' ? copy.phoneInvalid : code;
}

export function cartMessage(locale: Locale, code: string): string {
  const copy = getCartCopy(locale);
  const messages: Record<string, string> = {
    'invalid-command': copy.invalidCommand,
    'empty-cart': copy.emptyCommandCart,
    'invalid-line': copy.invalidLine,
    'duplicate-product': copy.duplicateProduct,
    'invalid-quantity': copy.quantityError,
    'quantity-overflow': copy.quantityOverflow,
    'invalid-price': copy.invalidPrice,
    'invalid-product': copy.invalidProduct,
    unavailable: copy.productUnavailable,
    'not-found': copy.notFound,
    removed: copy.removed,
    added: copy.added,
    'bulk-empty': copy.bulkEmpty,
    'bulk-added': copy.bulkAdded,
  };
  return Object.prototype.hasOwnProperty.call(messages, code) ? messages[code]! : code;
}

export function storageMessage(locale: Locale, code: string): string {
  const copy = getCartCopy(locale);
  if (['unavailable', 'storage-unavailable', 'read-failed', 'blocked'].includes(code)) {
    return copy.storageUnavailable;
  }
  if (code === 'remove-failed') return copy.storageRemoveFailed;
  if (code === 'invalid-data') return copy.storageInvalidData;
  return ['write-failed', 'storage-write-failed', 'quota-exceeded'].includes(code)
    ? copy.storageWriteFailed
    : code;
}
