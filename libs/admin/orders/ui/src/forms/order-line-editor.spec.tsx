import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';

import { OrderLineEditor } from './order-line-editor';

import type { CatalogLineInfo, OrderInputLine, OrderQuote } from '@admin/orders/model';

const catalogLines: CatalogLineInfo[] = [
  { productId: 'P1', productName: 'Кава', unitPrice: 10 },
];

function EditableCatalogLines() {
  const [lines, setLines] = useState<OrderInputLine[]>([{ productId: 'P1', quantity: 1 }]);
  return <OrderLineEditor lines={lines} quote={null} catalogLines={catalogLines} onChange={setLines} />;
}

describe('OrderLineEditor', () => {
  it('shows catalog name and recalculates the preview total when quantity changes', () => {
    render(<EditableCatalogLines />);

    expect(screen.getByText('Кава')).toBeTruthy();
    expect(screen.getByText(/Разом \(попередньо\): 10,00/)).toBeTruthy();
    expect((screen.getByRole('button', { name: 'Зменшити кількість товару P1' }) as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'Збільшити кількість товару P1' }));

    expect((screen.getByDisplayValue('2') as HTMLInputElement).value).toBe('2');
    expect(screen.getByText(/Разом \(попередньо\): 20,00/)).toBeTruthy();
    expect((screen.getByRole('button', { name: 'Зменшити кількість товару P1' }) as HTMLButtonElement).disabled).toBe(false);

    fireEvent.click(screen.getByRole('button', { name: 'Зменшити кількість товару P1' }));

    expect((screen.getByDisplayValue('1') as HTMLInputElement).value).toBe('1');
    expect(screen.getByText(/Разом \(попередньо\): 10,00/)).toBeTruthy();
  });

  it('uses the server quote amount instead of the catalog preview', () => {
    const quote: OrderQuote = {
      counterpartyId: 'C1',
      lines: [{ productId: 'P1', productName: 'Кава для клієнта', quantity: 2, unitPrice: 24, lineAmount: 48 }],
      totalAmount: 48,
      quoteFingerprint: 'quote-1',
    };

    render(
      <OrderLineEditor
        lines={[{ productId: 'P1', quantity: 2 }]}
        quote={quote}
        catalogLines={catalogLines}
        onChange={() => undefined}
      />,
    );

    expect(screen.getByText('Кава для клієнта')).toBeTruthy();
    expect(screen.getByText(/Разом: 48,00/)).toBeTruthy();
    expect(screen.queryByText(/Разом \(попередньо\): 20,00/)).toBeNull();
  });
});
