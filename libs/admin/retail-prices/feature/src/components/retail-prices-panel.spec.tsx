import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { RetailPricesPanel } from './retail-prices-panel';

import type { RetailPricesPanelController } from '../hooks/use-retail-prices-panel';

const controller = vi.hoisted(() => ({ current: {} as Partial<RetailPricesPanelController> }));

vi.mock('../hooks/use-retail-prices-panel', () => ({
  useRetailPricesPanel: () => controller.current,
}));

const base: Partial<RetailPricesPanelController> = {
  status: {
    priceTypeId: 11,
    priceTypeName: 'Розница халтмаг 30%',
    lockedCount: 0,
    lastLockedAt: null,
  },
  statusError: false,
  retryStatus: vi.fn(),
  file: null,
  chooseFile: vi.fn(),
  protectFromOneC: true,
  setProtectFromOneC: vi.fn(),
  upload: vi.fn(),
  uploading: false,
  unlock: vi.fn(),
  busy: false,
  result: null,
  error: null,
  notice: null,
  clearNotice: vi.fn(),
};

describe('RetailPricesPanel', () => {
  it('shows the status and the upload of the retail type', () => {
    controller.current = base;
    render(<RetailPricesPanel onClose={vi.fn()} open />);

    expect(screen.getByRole('dialog', { name: 'Роздрібні ціни з файлу' })).toBeTruthy();
    expect(screen.getByText('Тип ціни: «Розница халтмаг 30%»')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Завантажити' })).toBeTruthy();
  });

  it('shows the upload error and the result', () => {
    controller.current = {
      ...base,
      error: 'Це не файл Excel (.xlsx).',
      result: {
        changed: 1,
        unchanged: 0,
        notFoundCount: 0,
        notFoundCodes: [],
        withoutPriceCount: 0,
        withoutPriceCodes: [],
        status: base.status!,
      },
    };
    render(<RetailPricesPanel onClose={vi.fn()} open />);

    expect(screen.getByText('Це не файл Excel (.xlsx).')).toBeTruthy();
    expect(screen.getByText('Змінено: 1 · Без змін: 0')).toBeTruthy();
  });
});
