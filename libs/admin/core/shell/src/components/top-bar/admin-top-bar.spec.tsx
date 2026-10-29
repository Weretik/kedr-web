import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import { AdminTopBar } from './admin-top-bar';
import { AdminShellSessionProvider } from '../../providers/admin-shell-session-provider';
import { AdminSidebar } from '../layout/admin-sidebar';

vi.mock('./notifications-menu', () => ({ NotificationsMenu: () => null }));
vi.mock('./profile/profile-menu', () => ({ ProfileMenu: () => null }));
vi.mock('../theme/color-scheme-menu', () => ({ ColorSchemeMenu: () => null }));

describe('AdminTopBar order checkout link', () => {
  it('shows the distinct position count and navigates to the checkout page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AdminTopBar currentOrderPositionCount={3} onOpenNavigation={() => undefined} />
        <Routes>
          <Route element={<div>Домашня сторінка</div>} path="/" />
          <Route element={<div>Сторінка оформлення</div>} path="/orders/new" />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('3')).toBeTruthy();
    const checkoutLink = screen.getByRole('link', {
      name: 'Відкрити оформлення замовлення, позицій: 3',
    });
    expect(checkoutLink.getAttribute('href')).toBe('/orders/new');

    fireEvent.click(checkoutLink);

    expect(screen.getByText('Сторінка оформлення')).toBeTruthy();
  });
});

describe('AdminTopBar and sidebar role labels', () => {
  const renderFor = (isAdmin: boolean) =>
    render(
      <MemoryRouter>
        <AdminShellSessionProvider
          onLogout={async () => undefined}
          profileHref="/profile"
          user={{
            avatarUrl: null,
            canManageUsers: isAdmin,
            email: 'staff@kedr.ua',
            fullName: 'Олена',
            isAdmin,
            roleLabel: isAdmin ? 'Адміністратор' : 'Менеджер',
          }}
        >
          <AdminTopBar currentOrderPositionCount={0} onOpenNavigation={() => undefined} />
          <AdminSidebar currentOrderPositionCount={0} />
        </AdminShellSessionProvider>
      </MemoryRouter>,
    );

  it('names the admin cabinet and shows the Admin badge for an admin', () => {
    renderFor(true);

    expect(screen.getByText('Кабінет адміністратора')).toBeTruthy();
    expect(screen.getByText('Admin')).toBeTruthy();
  });

  it('names the manager cabinet and shows the Manager badge for a manager', () => {
    renderFor(false);

    expect(screen.getByText('Кабінет менеджера')).toBeTruthy();
    expect(screen.getByText('Manager')).toBeTruthy();
  });
});
