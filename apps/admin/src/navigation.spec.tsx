import { AdminLayout } from '@admin/core/shell';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

describe('Admin navigation', () => {
  it('shows read-only catalog and customer sections and keeps the nested section active', () => {
    render(
      <MemoryRouter initialEntries={['/customers/example-id']}>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="customers/:counterpartyId" element={<p>Картка клієнта</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    const navigation = screen.getAllByRole('navigation')[0];
    expect(within(navigation).getByRole('link', { name: 'Товари' })).toHaveAttribute(
      'href',
      '/catalog',
    );
    expect(within(navigation).getByRole('link', { name: 'Клієнти' })).toHaveAttribute(
      'href',
      '/customers',
    );
    expect(within(navigation).getByRole('link', { name: 'Клієнти' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.queryByRole('navigation', { name: 'Навігаційний шлях' })).toBeNull();
  });
});
