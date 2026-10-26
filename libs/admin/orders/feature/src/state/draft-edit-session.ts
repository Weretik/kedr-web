import type { OrderInputLine } from '@admin/orders/model';

export interface DraftEditSession {
  version: string;
  title: string;
  note: string;
  customerId: string;
  lines: OrderInputLine[];
}

const keyFor = (draftId: number) => `kedr-admin-draft-edit-${draftId}`;

export function readDraftEditSession(draftId: number): DraftEditSession | null {
  try {
    const data: unknown = JSON.parse(window.sessionStorage.getItem(keyFor(draftId)) ?? 'null');
    if (
      typeof data !== 'object' ||
      data === null ||
      !('version' in data) ||
      typeof data.version !== 'string' ||
      !('title' in data) ||
      typeof data.title !== 'string' ||
      !('note' in data) ||
      typeof data.note !== 'string' ||
      !('customerId' in data) ||
      typeof data.customerId !== 'string' ||
      !('lines' in data) ||
      !Array.isArray(data.lines) ||
      data.lines.length > 100 ||
      !data.lines.every(
        (line: unknown) =>
          typeof line === 'object' &&
          line !== null &&
          'productId' in line &&
          typeof line.productId === 'string' &&
          /^[1-9]\d{0,9}$/.test(line.productId) &&
          'quantity' in line &&
          typeof line.quantity === 'number' &&
          Number.isSafeInteger(line.quantity) &&
          line.quantity >= 1,
      )
    )
      return null;
    return data as DraftEditSession;
  } catch {
    return null;
  }
}
export function writeDraftEditSession(draftId: number, session: DraftEditSession) {
  try {
    window.sessionStorage.setItem(keyFor(draftId), JSON.stringify(session));
  } catch {
    // Unsaved edits stay in page state only.
  }
}
export function clearDraftEditSession(draftId: number) {
  try {
    window.sessionStorage.removeItem(keyFor(draftId));
  } catch {
    // Nothing to clear.
  }
}
export function addProductToDraftEdit(draftId: number, productId: string) {
  const session = readDraftEditSession(draftId);
  if (!session || !/^[1-9]\d{0,9}$/.test(productId)) return 'rejected';
  const existing = session.lines.find((line) => line.productId === productId);
  if (!existing && session.lines.length >= 100) return 'rejected';
  const lines = existing
    ? session.lines.map((line) =>
        line.productId === productId ? { ...line, quantity: line.quantity + 1 } : line,
      )
    : [...session.lines, { productId, quantity: 1 }];
  writeDraftEditSession(draftId, { ...session, lines });
  return 'saved';
}
