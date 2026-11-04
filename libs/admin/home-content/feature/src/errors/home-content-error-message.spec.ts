import { homeContentErrorMessage } from './home-content-error-message';

describe('homeContentErrorMessage', () => {
  it('words each failure for the page', () => {
    expect(homeContentErrorMessage({ status: 409, code: 'Conflict' }, 'reorder')).toContain(
      'інший користувач',
    );
    expect(homeContentErrorMessage({ code: 'Validation' }, 'saveBrand')).toContain('Логотипа');
    expect(homeContentErrorMessage({ code: 'Validation' }, 'saveFaq')).toContain('обидві мови');
    expect(homeContentErrorMessage({ code: 'NotFound' }, 'remove')).toContain('не знайдено');
    expect(homeContentErrorMessage(new Error('x'), 'saveFaq')).toBe(
      'Не вдалося зберегти. Спробуйте ще раз.',
    );
  });
});
