import {
  addCartLine,
  buildCheckoutCommand,
  changeCartQuantity,
  formatPhoneInput,
  getCartTotals,
  removeCartLine,
} from '@site/cart/model';

import { createCartDrawerFocus } from '../platform/cart-drawer-focus';

import type { createCartStorage } from '../storage/cart-storage';
import type {
  CartLine,
  CartPurchaseInput,
  CheckoutDraft,
  CheckoutField,
  CheckoutResult,
} from '@site/cart/model';

export type SubmitOrderAction = (command: unknown) => Promise<CheckoutResult>;
export type CartReceipt = { orderId: string; unitCount: number; goodsSubtotal: number };
export type CartSnapshot = {
  hydrated: boolean;
  lines: CartLine[];
  draft: CheckoutDraft;
  touched: { firstName: boolean; phone: boolean };
  recoveryRequired: boolean;
  discardedCount: number | null;
  storageIssue: string | null;
  notice: string | null;
  drawerOpen: boolean;
  pending: boolean;
  result: CheckoutResult | null;
  receipt: CartReceipt | null;
};

export const SERVER_CART_SNAPSHOT: CartSnapshot = {
  hydrated: false,
  lines: [],
  draft: { firstName: '', phone: '' },
  touched: { firstName: false, phone: false },
  recoveryRequired: false,
  discardedCount: 0,
  storageIssue: null,
  notice: null,
  drawerOpen: false,
  pending: false,
  result: null,
  receipt: null,
};

/** A browser/document owner; creating a store does not read or write storage. */
export function createCartClientStore(storage: ReturnType<typeof createCartStorage>) {
  let snapshot: CartSnapshot = {
    ...SERVER_CART_SNAPSHOT,
    lines: [],
    draft: { ...SERVER_CART_SNAPSHOT.draft },
    touched: { ...SERVER_CART_SNAPSHOT.touched },
  };
  const listeners = new Set<() => void>();
  let initialized = false;
  let readableStorage = false;
  let action: SubmitOrderAction | undefined;
  let inFlight: Promise<void> | undefined;
  const drawerFocus = createCartDrawerFocus();

  const update = (patch: Partial<CartSnapshot>) => {
    snapshot = { ...snapshot, ...patch };
    listeners.forEach((listener) => listener());
  };
  const persist = (lines: CartLine[]): string | null => {
    // A failed read must not be followed by an overwrite of an unknown saved basket.
    if (!readableStorage) return 'read-failed';
    const outcome = lines.length ? storage.write(lines) : storage.clear();
    return outcome.ok ? null : outcome.reason;
  };
  const commitLines = (lines: CartLine[]) => {
    let result = snapshot.receipt ? null : snapshot.result;
    if (
      result?.kind === 'validation' &&
      result.messages.some((message) => message === 'empty-cart')
    ) {
      result = {
        ...result,
        messages: result.messages.filter((message) => message !== 'empty-cart'),
      };
      if (!result.messages.length && !Object.keys(result.fieldErrors).length) result = null;
    }
    update({
      lines,
      receipt: null,
      result,
      notice: null,
      storageIssue: snapshot.recoveryRequired ? snapshot.storageIssue : persist(lines),
    });
  };
  const complete = (
    result: CheckoutResult,
    accepted: { unitCount: number; goodsSubtotal: number },
  ) => {
    if (result.kind !== 'created') {
      update({ pending: false, result });
      return;
    }
    const cleanup = readableStorage
      ? storage.clear()
      : { ok: false as const, reason: 'read-failed' };
    update({
      pending: false,
      result,
      receipt: { orderId: result.orderId, ...accepted },
      lines: [],
      draft: { firstName: '', phone: '' },
      touched: { firstName: false, phone: false },
      recoveryRequired: false,
      discardedCount: 0,
      notice: null,
      storageIssue: cleanup.ok ? null : cleanup.reason,
    });
  };

  return {
    getSnapshot: () => snapshot,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    initialize: () => {
      if (initialized) return;
      initialized = true;
      const read = storage.read();
      readableStorage = read.ok;
      if (!read.ok) {
        update({ hydrated: true, storageIssue: read.reason });
        return;
      }
      update({
        hydrated: true,
        lines: read.value.lines,
        recoveryRequired: read.value.kind === 'recovery-required',
        discardedCount: read.value.discardedCount,
      });
    },
    setSubmitOrderAction: (nextAction: SubmitOrderAction) => {
      action = nextAction;
    },
    add: (input: CartPurchaseInput, quantity = 1): boolean => {
      if (!snapshot.hydrated || snapshot.pending) return false;
      const outcome = addCartLine(snapshot.lines, input, quantity);
      if (!outcome.ok) {
        update({ notice: outcome.reason });
        return false;
      }
      commitLines(outcome.lines);
      return true;
    },
    setQuantity: (id: string, quantity: number): boolean => {
      if (!snapshot.hydrated || snapshot.pending) return false;
      const outcome = changeCartQuantity(snapshot.lines, id, quantity);
      if (!outcome.ok) {
        update({ notice: outcome.reason });
        return false;
      }
      commitLines(outcome.lines);
      return true;
    },
    remove: (id: string) => {
      if (
        !snapshot.hydrated ||
        snapshot.pending ||
        !snapshot.lines.some((line) => line.variantId === id)
      )
        return;
      commitLines(removeCartLine(snapshot.lines, id));
    },
    setDraft: (field: CheckoutField, value: string) => {
      if (snapshot.pending) return;
      let result = snapshot.result;
      if (result?.kind === 'validation' && result.fieldErrors[field]) {
        const fieldErrors = { ...result.fieldErrors };
        delete fieldErrors[field];
        result = { ...result, fieldErrors };
      }
      update({
        draft: { ...snapshot.draft, [field]: field === 'phone' ? formatPhoneInput(value) : value },
        result,
      });
    },
    touch: (field: CheckoutField) => {
      if (!snapshot.pending && !snapshot.touched[field])
        update({ touched: { ...snapshot.touched, [field]: true } });
    },
    acceptRecovery: () => {
      if (!snapshot.recoveryRequired || snapshot.pending) return;
      update({ recoveryRequired: false, discardedCount: 0, storageIssue: persist(snapshot.lines) });
    },
    discardRecovery: () => {
      if (!snapshot.recoveryRequired || snapshot.pending) return;
      update({
        lines: [],
        recoveryRequired: false,
        discardedCount: 0,
        storageIssue: persist([]),
        notice: null,
      });
    },
    openDrawer: (nextOpener?: HTMLElement) => {
      drawerFocus.remember(nextOpener);
      update({ drawerOpen: true });
    },
    closeDrawer: () => {
      if (snapshot.drawerOpen) update({ drawerOpen: false });
    },
    restoreDrawerFocus: drawerFocus.restore,
    submit: (): Promise<void> => {
      if (inFlight) return inFlight;
      if (!snapshot.hydrated || snapshot.recoveryRequired || snapshot.receipt)
        return Promise.resolve();
      const parsed = buildCheckoutCommand(snapshot.draft, snapshot.lines);
      if (!parsed.ok) {
        update({
          touched: { firstName: true, phone: true },
          result: { kind: 'validation', fieldErrors: parsed.fieldErrors, messages: parsed.issues },
        });
        return Promise.resolve();
      }
      const command = parsed.command;
      const accepted = getCartTotals(snapshot.lines);
      const submitAction = action;
      // Assign the lock before notifying synchronous subscribers; they may call submit again.
      inFlight = Promise.resolve()
        .then(() =>
          submitAction ? submitAction(command) : { kind: 'uncertain' as const, messages: [] },
        )
        .then((result) => {
          complete(result, accepted);
        })
        .catch(() => {
          complete({ kind: 'uncertain', messages: [] }, accepted);
        })
        .finally(() => {
          inFlight = undefined;
        });
      update({ pending: true, result: null, touched: { firstName: true, phone: true } });
      return inFlight;
    },
  };
}

export type CartClientStore = ReturnType<typeof createCartClientStore>;
