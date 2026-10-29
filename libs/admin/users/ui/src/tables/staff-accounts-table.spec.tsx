import { fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';

import { StaffAccountsTable } from './staff-accounts-table';

import type { StaffAccount } from '@admin/users/model';

const accounts: StaffAccount[] = [
  {
    id: 'admin-1',
    email: 'admin@kedr.ua',
    fullName: 'Адмін',
    role: 'Admin',
    isBlocked: false,
    avatarUrl: null,
  },
  {
    id: 'manager-1',
    email: 'manager@kedr.ua',
    fullName: 'Олена',
    role: 'Manager',
    isBlocked: true,
    avatarUrl: 'https://cdn.test/olena.webp',
  },
];

const renderTable = (onAction = vi.fn()) =>
  render(
    <StaffAccountsTable
      accounts={accounts}
      currentUserId="admin-1"
      error={false}
      loading={false}
      onAction={onAction}
      onRetry={vi.fn()}
    />,
  );

describe('StaffAccountsTable', () => {
  it('shows role and status for each account', () => {
    renderTable();

    const managerRow = screen.getByText('manager@kedr.ua').closest('tr') as HTMLElement;
    expect(within(managerRow).getByText('Менеджер')).toBeTruthy();
    expect(within(managerRow).getByText('Заблокований')).toBeTruthy();
  });

  it('does not let the admin demote or block themselves', () => {
    renderTable();
    fireEvent.click(screen.getByRole('button', { name: 'Дії для admin@kedr.ua' }));

    expect(screen.getByRole('menuitem', { name: /менеджер/ }).getAttribute('aria-disabled')).toBe(
      'true',
    );
    expect(
      screen.getByRole('menuitem', { name: 'Заблокувати' }).getAttribute('aria-disabled'),
    ).toBe('true');
  });

  it('asks to unblock a blocked manager', () => {
    const onAction = vi.fn();
    renderTable(onAction);
    fireEvent.click(screen.getByRole('button', { name: 'Дії для manager@kedr.ua' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Розблокувати' }));

    expect(onAction).toHaveBeenCalledWith(accounts[1], { type: 'setBlocked', blocked: false });
  });

  it('shows the photo or the initial next to the name', () => {
    renderTable();

    expect(screen.getByRole('img', { name: 'Олена' }).getAttribute('src')).toBe(
      'https://cdn.test/olena.webp',
    );
    const adminRow = screen.getByText('admin@kedr.ua').closest('tr') as HTMLElement;
    expect(within(adminRow).getByText('А')).toBeTruthy();
  });

  it('offers profile edits for managers only', () => {
    const onAction = vi.fn();
    renderTable(onAction);

    fireEvent.click(screen.getByRole('button', { name: 'Дії для manager@kedr.ua' }));
    expect(screen.getByRole('menuitem', { name: 'Змінити email' })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'Видалити фото' })).toBeTruthy();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Змінити імʼя' }));
    expect(onAction).toHaveBeenCalledWith(accounts[1], { type: 'changeName' });

    fireEvent.click(screen.getByRole('button', { name: 'Дії для admin@kedr.ua' }));
    expect(screen.queryByRole('menuitem', { name: 'Змінити імʼя' })).toBeNull();
    expect(screen.queryByRole('menuitem', { name: 'Встановити новий пароль' })).toBeNull();
  });
});
