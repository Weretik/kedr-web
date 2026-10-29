import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';

import { OrderLineEditor } from './order-line-editor';

import type { CatalogLineInfo, OrderInputLine, OrderQuote } from '@admin/orders/model';

const catalogLines: CatalogLineInfo[] = [{ productId: 'P1', productName: 'Кава', unitPrice: 10 }];

function EditableCatalogLines() {
  const [lines, setLines] = useState<OrderInputLine[]>([{ productId: 'P1', quantity: 1 }]);
  return (
    <OrderLineEditor
      lines={lines}
      quote={null}
      catalogLines={catalogLines}
      hasCustomer={false}
      onChange={setLines}
    />
  );
}

describe('OrderLineEditor', () => {
  it('shows catalog name and recalculates the preview total when quantity changes', () => {
    render(<EditableCatalogLines />);

    expect(screen.getByText('Кава')).toBeTruthy();
    expect(screen.getByText(/Разом \(попередньо\): 10,00/)).toBeTruthy();
    expect(
      (screen.getByRole('button', { name: 'Зменшити кількість товару P1' }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'Збільшити кількість товару P1' }));

    expect((screen.getByDisplayValue('2') as HTMLInputElement).value).toBe('2');
    expect(screen.getByText(/Разом \(попередньо\): 20,00/)).toBeTruthy();
    expect(
      (screen.getByRole('button', { name: 'Зменшити кількість товару P1' }) as HTMLButtonElement)
        .disabled,
    ).toBe(false);

    fireEvent.click(screen.getByRole('button', { name: 'Зменшити кількість товару P1' }));

    expect((screen.getByDisplayValue('1') as HTMLInputElement).value).toBe('1');
    expect(screen.getByText(/Разом \(попередньо\): 10,00/)).toBeTruthy();
  });

  it('uses the server quote amount instead of the catalog preview', () => {
    const quote: OrderQuote = {
      counterpartyId: 'C1',
      lines: [
        {
          productId: 'P1',
          productName: 'Кава для клієнта',
          quantity: 2,
          unitPrice: 24,
          lineAmount: 48,
          baseUnitPrice: 24,
          priceAdjustment: 0,
        },
      ],
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

  it('shows the customer price instead of retail once a customer is chosen', () => {
    render(
      <OrderLineEditor
        lines={[{ productId: 'P1', quantity: 2 }]}
        quote={null}
        catalogLines={catalogLines}
        customerPrices={{ P1: 8 }}
        onChange={() => undefined}
      />,
    );

    expect(screen.getByRole('columnheader', { name: 'Ціна клієнта' })).toBeTruthy();
    expect(screen.getByText(/Разом \(попередньо\): 16,00/)).toBeTruthy();
  });

  it('labels retail prices until a customer is chosen', () => {
    render(
      <OrderLineEditor
        lines={[{ productId: 'P1', quantity: 1 }]}
        quote={null}
        catalogLines={catalogLines}
        hasCustomer={false}
        onChange={() => undefined}
      />,
    );

    expect(screen.getByRole('columnheader', { name: 'Ціна (роздріб)' })).toBeTruthy();
    expect(screen.getByText(/Оберіть клієнта/)).toBeTruthy();
  });

  it('applies a per-unit discount to the total', () => {
    function WithCustomer() {
      const [lines, setLines] = useState<OrderInputLine[]>([{ productId: 'P1', quantity: 3 }]);
      return (
        <OrderLineEditor
          lines={lines}
          quote={null}
          customerPrices={{ P1: 100 }}
          onChange={setLines}
        />
      );
    }
    render(<WithCustomer />);

    fireEvent.change(screen.getByLabelText('Знижка або націнка за штуку, товар P1'), {
      target: { value: '-50' },
    });

    expect(screen.getByText(/50,00\s₴ за шт\./)).toBeTruthy();
    expect(screen.getByText(/Знижка: −150,00/)).toBeTruthy();
    expect(screen.getByText(/Разом \(попередньо\): 150,00/)).toBeTruthy();
  });

  it('rejects an amount with more than two decimals', () => {
    render(
      <OrderLineEditor
        lines={[{ productId: 'P1', quantity: 1 }]}
        quote={null}
        customerPrices={{ P1: 100 }}
        onChange={() => undefined}
      />,
    );

    fireEvent.change(screen.getByLabelText('Знижка або націнка за штуку, товар P1'), {
      target: { value: '-1,555' },
    });

    expect(screen.getByText(/до двох знаків після коми/)).toBeTruthy();
  });
});
