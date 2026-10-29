import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { OrderDocumentView } from './order-document-view';

describe('OrderDocumentView', () => {
  it('groups customer and document data in labelled sections with the 1C status and total', () => {
    render(
      <OrderDocumentView
        counterpartyId="C-1"
        customerName="ТОВ Кедр"
        date="2026-10-20T10:00:00Z"
        lines={[
          { productId: 'P1', productName: 'Кава', quantity: 2, unitPrice: 24, lineAmount: 48 },
        ]}
        note="Терміново"
        reference="KD-1"
        status="Accepted"
        totalAmount={48}
      />,
    );

    expect(screen.getByRole('region', { name: 'ТОВ Кедр' }).textContent).toContain('C-1');
    const document = screen.getByRole('region', { name: 'KD-1' });
    expect(document.textContent).toContain('Прийнято в 1С');
    expect(document.textContent).toContain('Терміново');
    expect(screen.getByRole('region', { name: 'Товари' }).textContent).toMatch(/Разом48,00/);
  });

  it('shows the per-unit adjustment column and the total adjustment only when a line has one', () => {
    render(
      <OrderDocumentView
        counterpartyId="C-1"
        customerName="ТОВ Кедр"
        date="2026-10-20T10:00:00Z"
        lines={[
          {
            productId: 'P1',
            productName: 'Кава',
            quantity: 3,
            unitPrice: 50,
            lineAmount: 150,
            priceAdjustment: -50,
          },
        ]}
        reference="KD-1"
        totalAmount={150}
      />,
    );

    expect(screen.getByRole('columnheader', { name: 'Знижка/Націнка за шт.' })).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Товари' }).textContent).toMatch(/Знижка: −150,00/);
  });
});
