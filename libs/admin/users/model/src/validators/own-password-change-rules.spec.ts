import { describe, expect, it } from 'vitest';

import { hasOwnPasswordErrors, ownPasswordChangeErrors } from './own-password-change-rules';

describe('ownPasswordChangeErrors', () => {
  it('asks for the current password, a valid new one, and a matching repeat', () => {
    const errors = ownPasswordChangeErrors({ currentPassword: '', newPassword: '123', repeat: '12' });
    expect(errors.currentPassword).toBe('Вкажіть поточний пароль.');
    expect(errors.newPassword).toBeDefined();
    expect(errors.repeat).toBe('Паролі не збігаються.');
    expect(hasOwnPasswordErrors(errors)).toBe(true);
  });

  it('has no errors for a complete change', () => {
    const errors = ownPasswordChangeErrors({
      currentPassword: 'old-secret',
      newPassword: 'new-secret-1',
      repeat: 'new-secret-1',
    });
    expect(hasOwnPasswordErrors(errors)).toBe(false);
  });
});
