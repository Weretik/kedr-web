import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { CreateStaffPanel } from './create-staff-panel';

describe('CreateStaffPanel', () => {
  it('checks the fields before sending', () => {
    const onSubmit = vi.fn();
    render(
      <CreateStaffPanel
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
      <CreateStaffPanel
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
  it('gives an existing customer staff access', async () => {
    const onGrant = vi.fn().mockResolvedValue(true);
    const onCandidateSearch = vi.fn();
    render(
      <CreateStaffPanel
        candidates={[
          { id: 'u-1', email: 'client@kedr.ua', fullName: 'ФОП Клієнт', isCustomer: true },
        ]}
        error={null}
        onCandidateSearch={onCandidateSearch}
        onClose={vi.fn()}
        onGrant={onGrant}
        onSubmit={vi.fn()}
        open
        submitting={false}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'З бази' }));
    expect(screen.queryByLabelText(/^Email/)).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Надати доступ' }));
    expect(onGrant).not.toHaveBeenCalled();
    expect(screen.getByText('Оберіть користувача зі списку.')).toBeTruthy();

    const picker = screen.getByRole('combobox', { name: /Користувач із бази/ });
    fireEvent.change(picker, { target: { value: 'client' } });
    expect(onCandidateSearch).toHaveBeenCalledWith('client');
    fireEvent.click(await screen.findByRole('option', { name: /ФОП Клієнт/ }));

    expect(screen.getByLabelText(/Імʼя/)).toHaveProperty('value', 'ФОП Клієнт');
    fireEvent.change(screen.getByLabelText(/Новий пароль/), { target: { value: 'password-1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Надати доступ' }));

    await waitFor(() =>
      expect(onGrant).toHaveBeenCalledWith({
        userId: 'u-1',
        fullName: 'ФОП Клієнт',
        role: 'Manager',
        password: 'password-1',
      }),
    );
  });
});
