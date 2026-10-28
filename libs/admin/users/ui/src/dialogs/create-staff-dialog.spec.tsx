import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { CreateStaffDialog } from './create-staff-dialog';

describe('CreateStaffDialog', () => {
  it('checks the fields before sending', () => {
    const onSubmit = vi.fn();
    render(
      <CreateStaffDialog
        error={null}
        onClose={vi.fn()}
        onSubmit={onSubmit}
        open
        submitting={false}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Створити' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Пароль має містити щонайменше 8 символів.')).toBeTruthy();
  });

  it('sends an admin account', async () => {
    const onSubmit = vi.fn().mockResolvedValue(true);
    const onClose = vi.fn();
    render(
      <CreateStaffDialog
        error={null}
        onClose={onClose}
        onSubmit={onSubmit}
        open
        submitting={false}
      />,
    );

    fireEvent.change(screen.getByLabelText(/Імʼя/), { target: { value: 'Іван' } });
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'ivan@kedr.ua' } });
    fireEvent.change(screen.getByLabelText(/Пароль/), { target: { value: 'password-1' } });
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Роль' }));
    fireEvent.click(screen.getByRole('option', { name: 'Адміністратор' }));
    fireEvent.click(screen.getByRole('button', { name: 'Створити' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'ivan@kedr.ua',
        fullName: 'Іван',
        role: 'Admin',
        password: 'password-1',
      }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});
