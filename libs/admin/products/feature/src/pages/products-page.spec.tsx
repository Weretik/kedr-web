import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ProductsPage from './products-page';

describe('ProductsPage', () => {
  it('renders the toolbar, breadcrumbs, and empty catalog state', () => {
    render(
      <MemoryRouter>
        <ProductsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Каталог товарів' })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: 'Товар' })).toBeTruthy();
    expect(screen.getByText('Показано 0 товарів')).toBeTruthy();
    expect(screen.getByText('Товарів поки немає')).toBeTruthy();
  });
});
