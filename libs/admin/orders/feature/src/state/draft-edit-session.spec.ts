import { beforeEach, describe, expect, it } from 'vitest';

import {
  addProductToDraftEdit,
  clearDraftEditSession,
  readDraftEditSession,
  writeDraftEditSession,
} from './draft-edit-session';

describe('draft edit session', () => {
  beforeEach(() => window.sessionStorage.clear());

  it('adds catalog products to the unsaved draft edit and clears it after save', () => {
    expect(addProductToDraftEdit(5, '7')).toBe('rejected');
    writeDraftEditSession(5, {
      version: 'v1',
      title: 'Змінена назва',
      note: '',
      customerId: 'C1',
      lines: [{ productId: '7', quantity: 1 }],
    });
    expect(addProductToDraftEdit(5, '7')).toBe('saved');
    expect(addProductToDraftEdit(5, '9')).toBe('saved');
    expect(readDraftEditSession(5)).toMatchObject({
      title: 'Змінена назва',
      lines: [
        { productId: '7', quantity: 2 },
        { productId: '9', quantity: 1 },
      ],
    });
    clearDraftEditSession(5);
    expect(readDraftEditSession(5)).toBeNull();
  });
});
