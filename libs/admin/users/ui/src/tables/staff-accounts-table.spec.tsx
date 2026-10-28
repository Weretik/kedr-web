import { fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';

import { StaffAccountsTable } from './staff-accounts-table';

import type { StaffAccount } from '@admin/users/model';

const accounts: StaffAccount[] = [
  { id: 'admin-1', email: 'admin@kedr.ua', fullName: 'Адмін', role: 'Admin', isBlocked: false },
  {
    id: 'manager-1',
    email: 'manager@kedr.ua',
    fullName: 'Олена',
    role: 'Manager',
    isBlocked: true,
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
});
