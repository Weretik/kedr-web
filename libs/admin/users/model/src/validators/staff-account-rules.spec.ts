import {
  validateGrantStaffAccessInput,
  validateStaffAccountInput,
  validateStaffPassword,
} from './staff-account-rules';

describe('staff account rules', () => {
  it('accepts a complete account', () => {
    expect(
      validateStaffAccountInput({
        email: 'm@kedr.ua',
        fullName: 'Олена',
        role: 'Manager',
        password: '12345678',
      }),
    ).toEqual({});
  });

  it('reports every invalid field', () => {
    const errors = validateStaffAccountInput({
      email: 'not-email',
      fullName: ' ',
      role: 'Admin',
      password: 'short',
    });

    expect(Object.keys(errors).sort()).toEqual(['email', 'fullName', 'password']);
  });

  it('requires at least 8 password characters', () => {
    expect(validateStaffPassword('1234567')).toBeDefined();
    expect(validateStaffPassword('12345678')).toBeUndefined();
  });
  it('needs a picked account, a name and a password to give staff access', () => {
    expect(
      Object.keys(
        validateGrantStaffAccessInput({ userId: '', fullName: '', role: 'Manager', password: '' }),
      ).sort(),
    ).toEqual(['fullName', 'password', 'userId']);
    expect(
      validateGrantStaffAccessInput({
        userId: 'u-1',
        fullName: 'Клієнт',
        role: 'Seo',
        password: 'password-1',
      }),
    ).toEqual({});
  });
});
