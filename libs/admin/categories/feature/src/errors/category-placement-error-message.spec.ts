import { describe, expect, it } from 'vitest';

import { categoryPlacementErrorMessage } from './category-placement-error-message';

const messages = { conflict: 'Категорія з такою назвою вже є тут.', fallback: 'Не вдалося.' };

describe('categoryPlacementErrorMessage', () => {
  it('names a conflict, shows the server check as it is, and falls back otherwise', () => {
    expect(categoryPlacementErrorMessage({ status: 409, code: 'Unknown' }, messages)).toBe(
      messages.conflict,
    );
    expect(
      categoryPlacementErrorMessage(
        { code: 'Validation', fieldErrors: { parentId: ['У цій категорії є моделі.'] } },
        messages,
      ),
    ).toBe('У цій категорії є моделі.');
    expect(categoryPlacementErrorMessage({ code: 'Server' }, messages)).toBe('Не вдалося.');
  });
});
