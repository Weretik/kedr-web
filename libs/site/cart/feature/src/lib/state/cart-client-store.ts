import {
  addCartLine,
  buildCheckoutCommand,
  changeCartQuantity,
  formatPhoneInput,
  getCartTotals,
  removeCartLine,
} from '@site/cart/model';

import {
  checkoutOutcome,
  SERVER_CART_SNAPSHOT,
  withoutEmptyCartMessage,
  withoutFieldError,
  type CartReceipt,
  type CartSnapshot,
  type SubmitOrderAction,
} from './cart-snapshot';
import { createCartDrawerFocus } from '../platform/cart-drawer-focus';

import type { createCartStorage } from '../storage/cart-storage';
import type { CartLine, CartPurchaseInput, CheckoutField, CheckoutResult } from '@site/cart/model';

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
    update({
      lines,
      receipt: null,
      result: snapshot.receipt ? null : withoutEmptyCartMessage(snapshot.result),
      notice: null,
      storageIssue: snapshot.recoveryRequired ? snapshot.storageIssue : persist(lines),
    });
  };
  const complete = (result: CheckoutResult, accepted: Omit<CartReceipt, 'orderId'>) => {
    const cleanup =
      result.kind === 'created' && readableStorage
        ? storage.clear()
        : { ok: false as const, reason: 'read-failed' };
    update(checkoutOutcome(result, accepted, cleanup.ok ? null : cleanup.reason));
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
      update({
        draft: { ...snapshot.draft, [field]: field === 'phone' ? formatPhoneInput(value) : value },
        result: withoutFieldError(snapshot.result, field),
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
export { SERVER_CART_SNAPSHOT };
export type { CartReceipt, CartSnapshot, SubmitOrderAction };
