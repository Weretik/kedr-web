import { render } from '@testing-library/react';

import ProductsPage from './products-page';

describe('ProductsPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProductsPage />);
    expect(baseElement).toBeTruthy();
  });
});
