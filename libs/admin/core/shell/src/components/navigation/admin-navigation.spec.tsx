import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { AdminNavigation } from './admin-navigation';
import { AdminShellSessionProvider } from '../../providers/admin-shell-session-provider';

const renderNavigation = (canManageUsers: boolean) =>
  render(
    <MemoryRouter>
      <AdminShellSessionProvider
        onLogout={async () => undefined}
        profileHref="/profile"
        user={{
          avatarUrl: null,
          canManageUsers,
          email: 'staff@kedr.ua',
          fullName: 'Staff',
          roleLabel: 'Роль',
        }}
      >
        <AdminNavigation />
      </AdminShellSessionProvider>
    </MemoryRouter>,
  );

describe('AdminNavigation by role', () => {
  it('shows the users section to an admin', () => {
    renderNavigation(true);

    expect(screen.getByRole('link', { name: 'Користувачі' }).getAttribute('href')).toBe('/users');
  });

  it('hides the users section from a manager', () => {
    renderNavigation(false);

    expect(screen.queryByRole('link', { name: 'Користувачі' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Замовлення' })).toBeTruthy();
  });
});
