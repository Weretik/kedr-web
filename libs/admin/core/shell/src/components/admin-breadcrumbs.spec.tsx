import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { AdminBreadcrumbs } from './admin-breadcrumbs';

describe('AdminBreadcrumbs', () => {
  it('hides breadcrumbs on the dashboard', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AdminBreadcrumbs />
      </MemoryRouter>
    );

    expect(screen.queryByLabelText('Навігаційний шлях')).toBeNull();
  });

  it('renders the catalog route with a dashboard link', () => {
    render(
      <MemoryRouter initialEntries={['/catalog']}>
        <AdminBreadcrumbs />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Кабінет' }).getAttribute('href')).toBe('/dashboard');
    expect(screen.getByText('Каталог товарів')).toBeTruthy();
  });
});
