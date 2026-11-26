import { siteRedirectErrorMessage } from './site-redirect-error-message';

describe('siteRedirectErrorMessage', () => {
  it('shows the server field messages', () => {
    expect(
      siteRedirectErrorMessage({
        code: 'Validation',
        message: 'x',
        fieldErrors: { to: ['Ланцюжок переадресацій.'] },
      }),
    ).toBe('Ланцюжок переадресацій.');
  });

  it('shows a conflict message as the server words it', () => {
    expect(
      siteRedirectErrorMessage({
        code: 'Unknown',
        status: 409,
        message: 'Для цієї адреси переадресація вже є.',
      }),
    ).toBe('Для цієї адреси переадресація вже є.');
  });

  it('names missing rights, a removed row, and anything else', () => {
    expect(siteRedirectErrorMessage({ code: 'Forbidden', message: '' })).toBe(
      'Недостатньо прав для цієї дії.',
    );
    expect(siteRedirectErrorMessage({ code: 'NotFound', message: '' })).toMatch(/вже немає/);
    expect(siteRedirectErrorMessage(new Error('boom'))).toBe(
      'Не вдалося зберегти. Спробуйте ще раз.',
    );
  });
});
