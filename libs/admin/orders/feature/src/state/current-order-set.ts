import { useSyncExternalStore } from 'react';

import { setCurrentOrderCustomer } from './current-order-customer';
import {
  isValidProductId,
  maxOrderSetLines,
  orderSetStorageKey,
  parseOrderSet,
  serializeOrderSet,
} from './current-order-set.storage';

import type { OrderInputLine } from '@admin/orders/model';

type Warning = 'invalid' | 'storage' | 'conflict' | null;
export interface CurrentOrderSet {
  lines: OrderInputLine[];
  warning: Warning;
}
let snapshot: CurrentOrderSet = { lines: [], warning: null };
let initialized = false;
let external: OrderInputLine[] | null = null;
const listeners = new Set<() => void>();
const emit = () => {
  for (const listener of listeners) listener();
};
const replace = (lines: OrderInputLine[], warning: Warning = null) => {
  snapshot = { lines, warning };
  emit();
};

function persist(lines: OrderInputLine[]) {
  replace(lines);
  try {
    window.localStorage.setItem(orderSetStorageKey, serializeOrderSet(lines));
    return true;
  } catch {
    replace(lines, 'storage');
    return false;
  }
}
function initialize() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  try {
    snapshot = {
      lines: parseOrderSet(window.localStorage.getItem(orderSetStorageKey)),
      warning: null,
    };
  } catch {
    snapshot = { lines: [], warning: 'invalid' };
  }
  window.addEventListener('storage', (event) => {
    if (event.key !== orderSetStorageKey) return;
    try {
      const incoming = parseOrderSet(event.newValue);
      if (JSON.stringify(incoming) !== JSON.stringify(snapshot.lines)) {
        external = incoming;
        replace(snapshot.lines, 'conflict');
      }
    } catch {
      replace(snapshot.lines, 'invalid');
    }
  });
}
export function getCurrentOrderSet(): CurrentOrderSet {
  initialize();
  return snapshot;
}
export function subscribeCurrentOrderSet(listener: () => void) {
  initialize();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export function useCurrentOrderSet() {
  return useSyncExternalStore(subscribeCurrentOrderSet, getCurrentOrderSet, () => snapshot);
}
export function setCurrentOrderLines(lines: OrderInputLine[]) {
  initialize();
  if (snapshot.warning !== 'conflict') persist(lines);
}
export function addProductToCurrentOrder(productId: string, quantity = 1) {
  initialize();
  if (snapshot.warning === 'conflict') return 'rejected';
  if (!isValidProductId(productId) || !Number.isSafeInteger(quantity) || quantity < 1)
    return 'rejected';
  const existing = snapshot.lines.find((line) => line.productId === productId);
  if (!existing && snapshot.lines.length >= maxOrderSetLines) return 'rejected';
  const next = existing
    ? snapshot.lines.map((line) =>
        line.productId === productId ? { ...line, quantity: line.quantity + quantity } : line,
      )
    : [...snapshot.lines, { productId, quantity }];
  if (next.some((line) => !Number.isSafeInteger(line.quantity))) return 'rejected';
  return persist(next) ? 'saved' : 'volatile';
}
export function mergeDraftIntoCurrentOrder(lines: OrderInputLine[]) {
  initialize();
  if (snapshot.warning === 'conflict') return false;
  const map = new Map(snapshot.lines.map((line) => [line.productId, { ...line }]));
  for (const line of lines) {
    const existing = map.get(line.productId);
    // A product already in the set keeps its own adjustment; a new one brings the draft's.
    map.set(
      line.productId,
      existing ? { ...existing, quantity: existing.quantity + line.quantity } : { ...line },
    );
  }
  const merged = [...map.values()];
  if (
    merged.length > maxOrderSetLines ||
    merged.some((line) => !Number.isSafeInteger(line.quantity) || line.quantity < 1)
  )
    return false;
  persist(merged);
  return true;
}
export function clearCurrentOrder() {
  initialize();
  replace([]);
  setCurrentOrderCustomer('');
  try {
    window.localStorage.removeItem(orderSetStorageKey);
  } catch {
    replace([], 'storage');
  }
}
export function acceptExternalOrderSet() {
  if (external) {
    persist(external);
    external = null;
  }
}
export function keepCurrentOrderSet() {
  persist(snapshot.lines);
  external = null;
}
