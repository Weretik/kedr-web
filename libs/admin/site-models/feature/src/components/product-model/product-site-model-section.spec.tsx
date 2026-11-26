import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ProductSiteModelSection } from './product-site-model-section';

vi.mock('../panels/site-model-panels-provider', () => ({
  SiteModelPanelsProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="panels">{children}</div>
  ),
}));

vi.mock('./product-site-model-card', () => ({
  ProductSiteModelCard: ({ productId }: { productId: number }) => <span>model of {productId}</span>,
}));

describe('ProductSiteModelSection', () => {
  it('renders the card inside its own panels provider', () => {
    render(<ProductSiteModelSection productId={7} />);

    expect(screen.getByTestId('panels').textContent).toBe('model of 7');
  });
});
