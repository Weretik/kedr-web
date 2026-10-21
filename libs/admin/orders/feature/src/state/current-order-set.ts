import { useSyncExternalStore } from 'react';

import type { OrderInputLine } from '@admin/orders/model';

const key = 'kedr-admin-current-order-set';
const version = 1;
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

function parse(value: string | null): OrderInputLine[] {
  if (value === null) return [];
  const data: unknown = JSON.parse(value);
  if (
    typeof data !== 'object' ||
    data === null ||
    !('version' in data) ||
    data.version !== version ||
    !('lines' in data) ||
    !Array.isArray(data.lines) ||
    data.lines.length > 100
  )
    throw new Error('Invalid saved order set');
  const seen = new Set<string>();
  return data.lines.map((line: unknown) => {
    if (
      typeof line !== 'object' ||
      line === null ||
      !('productId' in line) ||
      !('quantity' in line) ||
      typeof line.productId !== 'string' ||
      !/^[1-9]\d{0,9}$/.test(line.productId) ||
      typeof line.quantity !== 'number' ||
      !Number.isSafeInteger(line.quantity) ||
      line.quantity < 1 ||
      seen.has(line.productId)
    )
      throw new Error('Invalid saved order line');
    seen.add(line.productId);
    return { productId: line.productId, quantity: line.quantity };
  });
}
function persist(lines: OrderInputLine[]) {
  replace(lines);
  try {
    window.localStorage.setItem(key, JSON.stringify({ version, lines }));
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
    snapshot = { lines: parse(window.localStorage.getItem(key)), warning: null };
  } catch {
    snapshot = { lines: [], warning: 'invalid' };
  }
  window.addEventListener('storage', (event) => {
    if (event.key !== key) return;
    try {
      const incoming = parse(event.newValue);
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
  if (!/^[1-9]\d{0,9}$/.test(productId) || !Number.isSafeInteger(quantity) || quantity < 1)
    return 'rejected';
  const existing = snapshot.lines.find((line) => line.productId === productId);
  if (!existing && snapshot.lines.length >= 100) return 'rejected';
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
  const map = new Map(snapshot.lines.map((line) => [line.productId, line.quantity]));
  for (const line of lines) map.set(line.productId, (map.get(line.productId) ?? 0) + line.quantity);
  const merged = [...map].map(([productId, quantity]) => ({ productId, quantity }));
  if (
    merged.length > 100 ||
    merged.some((line) => !Number.isSafeInteger(line.quantity) || line.quantity < 1)
  )
    return false;
  persist(merged);
  return true;
}
export function clearCurrentOrder() {
  initialize();
  replace([]);
  try {
    window.localStorage.removeItem(key);
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
