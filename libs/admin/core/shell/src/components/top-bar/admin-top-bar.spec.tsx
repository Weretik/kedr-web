import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import { AdminTopBar } from './admin-top-bar';

vi.mock('./notifications-menu', () => ({ NotificationsMenu: () => null }));
vi.mock('./profile-menu', () => ({ ProfileMenu: () => null }));
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
