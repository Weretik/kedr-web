import { describe, expect, it } from 'vitest';

import {
  codesText,
  importErrorMessage,
  lockedStatusText,
  unlockConfirmText,
  unlockErrorMessage,
} from './retail-price-text';

const status = (lockedCount: number, lastLockedAt: string | null = null) => ({
  priceTypeId: 11,
  priceTypeName: 'Розница халтмаг 30%',
  lockedCount,
  lastLockedAt,
});

describe('retail price texts', () => {
  it('says how many prices 1C does not update and when the file came, in Kyiv time', () => {
    expect(lockedStatusText(status(1567, '2026-11-26T11:05:00Z'))).toBe(
      'З 1С не оновлюються 1567 цін (останнє завантаження 26.11.2026, 13:05)',
    );
    expect(lockedStatusText(status(1))).toBe('З 1С не оновлюється 1 ціна');
    expect(lockedStatusText(status(3))).toBe('З 1С не оновлюються 3 ціни');
    expect(lockedStatusText(status(0))).toBeNull();
  });

  it('lists the reported codes and how many more there are', () => {
    expect(codesText(['999', 'АБВ'], 2)).toBe('999, АБВ');
    expect(codesText(['1', '2'], 60)).toBe('1, 2 і ще 58');
  });

  it('asks before giving the prices back to 1C', () => {
    expect(unlockConfirmText(3)).toBe(
      'Повернути 3 ціни під 1С? Ціни зміняться при наступній синхронізації з 1С.',
    );
  });

  it.each([
    [
      {
        code: 'Validation',
        status: 400,
        message: 'x',
        fieldErrors: { file: ['Це не файл Excel (.xlsx).'] },
      },
      'Це не файл Excel (.xlsx).',
    ],
    [
      { code: 'Validation', status: 400, message: 'Виберіть файл з цінами.' },
      'Виберіть файл з цінами.',
    ],
    [
      { code: 'Unknown', status: 409, message: 'Ціни саме оновлюються з 1С. Спробуйте ще раз.' },
      'Ціни саме оновлюються з 1С. Спробуйте ще раз.',
    ],
    [{ code: 'Unknown', status: 413, message: 'x' }, 'Файл завеликий: до 10 МБ.'],
    [
      { code: 'Server', status: 500, message: 'boom' },
      'Не вдалося завантажити ціни. Спробуйте ще раз.',
    ],
  ])('explains an upload failure %#', (error, text) => {
    expect(importErrorMessage(error)).toBe(text);
  });

  it('explains an unlock failure', () => {
    expect(
      unlockErrorMessage({ code: 'Unknown', status: 409, message: 'Ціни саме оновлюються з 1С.' }),
    ).toBe('Ціни саме оновлюються з 1С.');
    expect(unlockErrorMessage({ code: 'Server', status: 500, message: 'boom' })).toBe(
      'Не вдалося повернути ціни під 1С. Спробуйте ще раз.',
    );
  });
});
