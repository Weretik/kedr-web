import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { AdminNavigation } from './admin-navigation';
import { AdminShellSessionProvider } from '../../providers/admin-shell-session-provider';

const renderNavigation = (canManageUsers: boolean, path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AdminShellSessionProvider
        onLogout={async () => undefined}
        profileHref="/profile"
        user={{
          avatarUrl: null,
          canManageUsers,
          isAdmin: canManageUsers,
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
    fireEvent.click(screen.getByRole('button', { name: 'Система' }));

    expect(screen.getByRole('link', { name: 'Користувачі' }).getAttribute('href')).toBe('/users');
  });

  it('hides the users section from a manager', () => {
    renderNavigation(false, '/orders');

    expect(screen.queryByRole('link', { name: 'Користувачі' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Замовлення' })).toBeTruthy();
  });

  it('hides the whole «Система» block from a manager', () => {
    renderNavigation(false);

    expect(screen.queryByRole('button', { name: 'Система' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Продаж' })).toBeTruthy();
  });

  it('opens the block of the current page and collapses it on click', () => {
    renderNavigation(true, '/catalog');

    const catalog = screen.getByRole('button', { name: 'Каталог' });
    expect(catalog.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('link', { name: 'Товари' }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('button', { name: 'Продаж' }).getAttribute('aria-expanded')).toBe(
      'false',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Продаж' }));
    expect(screen.getByRole('link', { name: 'Замовлення' })).toBeTruthy();
  });
});
