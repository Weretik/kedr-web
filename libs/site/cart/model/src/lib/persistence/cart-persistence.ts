import { isRecord, parseCartLine } from '../cart/cart-validation';
import { MAX_CART_QUANTITY } from '../cart/quantity';

import type { CartLine } from '../cart/cart-types';

export const CART_STORAGE_KEY = 'cart_v1';

export type CartDecodeResult =
  | { kind: 'ready'; lines: CartLine[]; discardedCount: 0 }
  | { kind: 'recovery-required'; lines: CartLine[]; discardedCount: number | null };

export type CartSerializeResult =
  { ok: true; value: string } | { ok: false; reason: 'invalid-data' };

export function decodeCartStorage(raw: string | null): CartDecodeResult {
  if (raw === null) return { kind: 'ready', lines: [], discardedCount: 0 };
  let decoded: unknown;
  try {
    decoded = JSON.parse(raw);
  } catch {
    return { kind: 'recovery-required', lines: [], discardedCount: null };
  }
  if (!isRecord(decoded) || !Array.isArray(decoded.lines)) {
    return { kind: 'recovery-required', lines: [], discardedCount: null };
  }
  const groups = new Map<string, { line: CartLine; sourceCount: number }>();
  let discardedCount = 0;
  for (const source of decoded.lines) {
    const line = parseCartLine(source);
    if (!line) {
      discardedCount++;
      continue;
    }
    const group = groups.get(line.variantId);
    if (!group) groups.set(line.variantId, { line, sourceCount: 1 });
    else {
      group.line.quantity += line.quantity;
      group.sourceCount++;
    }
  }
  const lines: CartLine[] = [];
  for (const { line, sourceCount } of groups.values()) {
    if (line.quantity > MAX_CART_QUANTITY) discardedCount += sourceCount;
    else lines.push(line);
  }
  return discardedCount
    ? { kind: 'recovery-required', lines, discardedCount }
    : { kind: 'ready', lines, discardedCount: 0 };
}

export function serializeCartStorage(lines: readonly CartLine[]): CartSerializeResult {
  if (!Array.isArray(lines)) return { ok: false, reason: 'invalid-data' };
  const accepted: CartLine[] = [];
  const identities = new Set<string>();
  for (const input of lines) {
    const line = parseCartLine(input);
    if (!line || identities.has(line.variantId)) return { ok: false, reason: 'invalid-data' };
    identities.add(line.variantId);
    accepted.push(line);
  }
  return { ok: true, value: JSON.stringify({ lines: accepted }) };
}
