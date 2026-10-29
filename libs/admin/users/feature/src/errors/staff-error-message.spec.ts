import { getStaffErrorMessage } from './staff-error-message';

describe('getStaffErrorMessage', () => {
  it('explains a duplicate email', () => {
    expect(getStaffErrorMessage({ code: 'Unknown', status: 409, message: 'Conflict' })).toBe(
      'Користувач з таким email вже існує.',
    );
  });

  it('lists server validation messages', () => {
    expect(
      getStaffErrorMessage({
        code: 'Validation',
        status: 400,
        message: 'x',
        fieldErrors: { password: ['Too short.'] },
      }),
    ).toBe('Перевірте дані: Too short.');
  });

  it('explains a wrong current password', () => {
    expect(
      getStaffErrorMessage({
        code: 'Validation',
        status: 400,
        message: 'x',
        fieldErrors: { currentPassword: ['The current password is incorrect.'] },
      }),
    ).toBe('Невірний поточний пароль.');
  });

  it('translates photo limits and an unavailable storage', () => {
    expect(
      getStaffErrorMessage({
        code: 'Validation',
        status: 400,
        message: 'x',
        fieldErrors: { file: ['The photo is larger than 2 MB.'] },
      }),
    ).toBe('Фото завелике. Максимум — 2 МБ.');
    expect(getStaffErrorMessage({ code: 'Server', status: 503, message: 'x' })).toContain(
      'Сховище фото',
    );
  });

  it('falls back for unknown errors', () => {
    expect(getStaffErrorMessage(new Error('boom'))).toBe(
      'Не вдалося виконати дію. Спробуйте ще раз.',
    );
  });
});
