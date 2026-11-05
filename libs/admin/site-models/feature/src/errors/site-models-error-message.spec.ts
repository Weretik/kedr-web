import { describe, expect, it } from 'vitest';

import { siteModelsErrorMessage } from './site-models-error-message';

describe('site models error message', () => {
  it('explains a product already in another model', () => {
    expect(
      siteModelsErrorMessage({
        status: 400,
        fieldErrors: { productIds: ['Products already in another model: 7 («Ручка»).'] },
      }),
    ).toBe('Товар уже в іншій прийнятій моделі: спершу приберіть його звідти.');
  });

  it('falls back to access and generic messages', () => {
    expect(siteModelsErrorMessage({ status: 403 })).toBe('Недостатньо прав для цієї дії.');
    expect(siteModelsErrorMessage(new Error('x'))).toBe('Не вдалося зберегти. Спробуйте ще раз.');
  });
});
