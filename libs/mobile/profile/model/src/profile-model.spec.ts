import {
  profileErrorMessage,
  roleLabel,
  validateEmail,
  validateName,
  validateNewPassword,
} from './index';

describe('profile rules', () => {
  it('checks the name, email and new password', () => {
    expect(validateName('  ')).toBe('Вкажіть імʼя.');
    expect(validateName('Олена')).toBeNull();
    expect(validateEmail('olena@')).toBe('Вкажіть коректний e-mail.');
    expect(validateEmail(' olena@kedr.ua ')).toBeNull();
    expect(validateNewPassword('short', 'short')).toBe('Щонайменше 8 символів.');
    expect(validateNewPassword('longenough', 'other')).toBe('Паролі не збігаються.');
    expect(validateNewPassword('longenough', 'longenough')).toBeNull();
  });

  it('names the role (SC-021)', () => {
    expect(roleLabel(['Manager'])).toBe('Менеджер');
    expect(roleLabel(['Manager', 'Admin'])).toBe('Адміністратор');
  });

  it('explains server refusals (SC-022)', () => {
    expect(
      profileErrorMessage({ code: 'Validation', fieldErrors: { currentPassword: ['x'] } }),
    ).toBe('Невірний поточний пароль.');
    expect(profileErrorMessage({ code: 'Unknown', status: 409 })).toBe(
      'Цей e-mail уже використовується.',
    );
    expect(profileErrorMessage({ code: 'Network' })).toMatch(/Немає звʼязку/);
  });
});
