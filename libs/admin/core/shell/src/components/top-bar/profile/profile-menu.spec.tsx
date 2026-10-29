import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import { ProfileMenu } from './profile-menu';
import { AdminShellSessionProvider } from '../../../providers/admin-shell-session-provider';

import type { AdminShellUser } from '../../../providers/admin-shell-session-provider';

const manager: AdminShellUser = {
  avatarUrl: null,
  canManageUsers: false,
  email: 'olena@kedr.ua',
  fullName: 'Олена Коваль',
  roleLabel: 'Менеджер',
};

function renderMenu(onLogout = vi.fn().mockResolvedValue(undefined)) {
  render(
    <MemoryRouter initialEntries={['/']}>
      <AdminShellSessionProvider onLogout={onLogout} profileHref="/profile" user={manager}>
        <ProfileMenu />
        <Routes>
          <Route element={<div>Головна</div>} path="/" />
          <Route element={<div>Сторінка кабінету</div>} path="/profile" />
        </Routes>
      </AdminShellSessionProvider>
    </MemoryRouter>,
  );

  return onLogout;
}

describe('ProfileMenu', () => {
  it('shows the initial without a photo and the profile card when opened', () => {
    renderMenu();

    expect(screen.getByText('О')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Відкрити меню профілю' }));

    expect(screen.getByText('Олена Коваль')).toBeTruthy();
    expect(screen.getByText('olena@kedr.ua')).toBeTruthy();
    expect(screen.getByText('Менеджер')).toBeTruthy();
  });

  it('opens the cabinet', () => {
    renderMenu();

    fireEvent.click(screen.getByRole('button', { name: 'Відкрити меню профілю' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Мій кабінет' }));

    expect(screen.getByText('Сторінка кабінету')).toBeTruthy();
  });

  it('signs out', () => {
    const onLogout = renderMenu();

    fireEvent.click(screen.getByRole('button', { name: 'Відкрити меню профілю' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Вийти' }));

    expect(onLogout).toHaveBeenCalledOnce();
  });
});
