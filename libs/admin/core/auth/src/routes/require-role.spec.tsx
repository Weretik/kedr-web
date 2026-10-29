import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { RequireRole } from './require-role';
import { setSessionState } from '../session/session-store';
import { canManageUsers } from '../session/session-user';

const renderUsersRoute = () =>
  render(
    <MemoryRouter initialEntries={['/users']}>
      <Routes>
        <Route element={<RequireRole allow={canManageUsers} />}>
          <Route element={<p>Сторінка користувачів</p>} path="users" />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

describe('RequireRole', () => {
  it('opens the section for an admin', () => {
    setSessionState({
      status: 'authenticated',
      user: { id: '1', email: 'a@kedr.ua', fullName: 'A', roles: ['Admin'], avatarUrl: null },
    });
    renderUsersRoute();

    expect(screen.getByText('Сторінка користувачів')).toBeTruthy();
  });

  it('shows "no access" to a manager', () => {
    setSessionState({
      status: 'authenticated',
      user: { id: '2', email: 'm@kedr.ua', fullName: 'M', roles: ['Manager'], avatarUrl: null },
    });
    renderUsersRoute();

    expect(screen.getByRole('heading', { name: 'Немає доступу' })).toBeTruthy();
    expect(screen.queryByText('Сторінка користувачів')).toBeNull();
  });
});
