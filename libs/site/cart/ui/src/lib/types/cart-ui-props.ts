import type {
  CartLine,
  CheckoutDraft,
  CheckoutField,
  CheckoutFieldErrors,
  CheckoutResult,
} from '@site/cart/model';
import type { CompanyContacts } from '@site/core/config';
import type { Locale } from '@site/core/i18n';

export interface CartLineView extends CartLine {
  productHref: string | null;
}

export type BasketProps = {
  locale: Locale;
  lines: CartLineView[];
  restoring: boolean;
  pending: boolean;
  recovery: { discardedCount: number | null } | null;
  storageIssue?: string | null;
  notice?: string | null;
  onChangeQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onAcceptRecovery: () => void;
  onDiscardRecovery: () => void;
};

export type CartDrawerProps = BasketProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReturnFocus: () => void;
  onCheckout: () => void;
};

export type CheckoutReceipt = {
  orderId: string;
  unitCount: number;
  goodsSubtotal: number;
};

export type CheckoutViewProps = BasketProps & {
  draft: CheckoutDraft;
  fieldErrors: CheckoutFieldErrors;
  formMessages: string[];
  resultKind: CheckoutResult['kind'] | null;
  receipt: CheckoutReceipt | null;
  canSubmit: boolean;
  /** Sales phone from the admin for the help line and the confirmation. */
  phone: CompanyContacts['phone'];
  onDraftChange: (field: CheckoutField, value: string) => void;
  onFieldBlur: (field: CheckoutField) => void;
  onSubmit: () => void;
};

export type CartHeaderButtonProps = {
  locale: Locale;
  compact?: boolean;
  unitCount: number;
  goodsSubtotal: number;
  restoring: boolean;
  open: boolean;
  onOpen: (opener: HTMLButtonElement) => void;
};

export type CartQuickAddButtonProps = {
  locale: Locale;
  title: string;
  onAdd: (opener: HTMLElement) => void;
  disabled: boolean;
};

export type CartPurchaseControlProps = {
  locale: Locale;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAdd: () => void;
  disabled: boolean;
  added: boolean;
  message?: string | null;
};
