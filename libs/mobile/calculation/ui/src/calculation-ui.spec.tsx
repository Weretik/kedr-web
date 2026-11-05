import {
  calculationTotals,
  priceLine,
  type OutboxEntry,
  LineProduct,
} from '@mobile/calculation/model';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { CalculationFooter } from './components/calculation-footer';
import { CalculationLineRow } from './components/calculation-line-row';
import { OutboxRow } from './components/outbox-row';
import { ReviewBanner } from './components/review-banner';

const product: LineProduct = {
  id: 7,
  name: 'Петля дверна',
  priceKopecks: 41_200,
  stock: 10,
};

const handlers = () => ({
  onChangeAdjustment: jest.fn(),
  onChangeQuantity: jest.fn(),
  onRemove: jest.fn(),
});

describe('CalculationLineRow', () => {
  it('shows a discount in red terms and the line amount (SC-011)', async () => {
    const line = priceLine({ adjustmentKopecks: -1_000, productId: 7, quantity: 4 }, product);
    await render(<CalculationLineRow line={line} {...handlers()} />);

    expect(screen.getByText('−10 ₴/шт')).toBeTruthy();
    expect(screen.getByText(/1\s?608,00/)).toBeTruthy();
    expect(screen.getByDisplayValue('−10')).toBeTruthy();
  });

  it('passes a typed adjustment on and explains a wrong one', async () => {
    const props = handlers();
    const line = priceLine({ adjustmentKopecks: 0, productId: 7, quantity: 1 }, product);
    await render(<CalculationLineRow line={line} {...props} />);
    const field = screen.getByLabelText('Знижка або націнка, гривень за штуку: Петля дверна');

    await fireEvent.changeText(field, '+5');
    expect(props.onChangeAdjustment).toHaveBeenLastCalledWith(500);

    await fireEvent.changeText(field, 'abc');
    expect(screen.getByText('Введіть суму в гривнях, наприклад −10 або 5')).toBeTruthy();
  });

  it('says how far a discount may go below 1 ₴ (SC-012)', async () => {
    const line = priceLine(
      { adjustmentKopecks: -500, productId: 7, quantity: 1 },
      { ...product, priceKopecks: 500 },
    );
    await render(<CalculationLineRow line={line} {...handlers()} />);

    expect(screen.getByText('Ціна не може бути нижче 1 ₴: найбільша знижка −4')).toBeTruthy();
  });

  it('marks a line the server changed', async () => {
    const line = priceLine({ adjustmentKopecks: 0, productId: 7, quantity: 1 }, product);
    await render(<CalculationLineRow changed line={line} {...handlers()} />);

    expect(screen.getByText('змінено на сервері')).toBeTruthy();
  });
});

describe('CalculationFooter', () => {
  it('shows the adjustment total and total, and stops sending a line with a problem', async () => {
    const good = priceLine({ adjustmentKopecks: -1_000, productId: 7, quantity: 4 }, product);
    const onSend = jest.fn();
    const { rerender } = await render(
      <CalculationFooter
        onSaveDraft={jest.fn()}
        onSend={onSend}
        totals={calculationTotals([good])}
      />,
    );
    expect(screen.getByText(/Знижка −40,00/)).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Відправити в 1С' }));
    expect(onSend).toHaveBeenCalled();

    const bad = priceLine(
      { adjustmentKopecks: 0, productId: 7, quantity: 1 },
      { ...product, stock: 0 },
    );
    await rerender(
      <CalculationFooter
        onSaveDraft={jest.fn()}
        onSend={onSend}
        totals={calculationTotals([bad])}
      />,
    );
    expect(screen.getByRole('button', { name: 'Відправити в 1С' })).toBeDisabled();
    expect(screen.getByText('Виправте позначені рядки')).toBeTruthy();
  });
});

describe('OutboxRow and ReviewBanner', () => {
  const entry: OutboxEntry = {
    attempts: 0,
    counterpartyId: 'cp',
    createdAt: 1,
    id: 'e1',
    idempotencyKey: 'k',
    kind: 'order-create',
    lastError: null,
    nextAttemptAt: 1,
    orderNumber: null,
    payload: {
      comment: null,
      counterpartyId: 'cp',
      customerName: 'Будмаркет',
      expectedBaseKopecks: {},
      lines: [],
      sourceDraft: null,
      totalKopecks: 160_800,
    },
    review: null,
    state: 'pending',
  };

  it('shows a queued order and then its number (SC-016)', async () => {
    const { rerender } = await render(<OutboxRow entry={entry} />);
    expect(screen.getByText('У черзі')).toBeTruthy();

    await rerender(<OutboxRow entry={{ ...entry, orderNumber: 'КД-1', state: 'done' }} />);
    expect(screen.getByText('№ КД-1')).toBeTruthy();
    expect(screen.queryByText('У черзі')).toBeNull();
  });

  it('opens a returned order with its reason (SC-017)', async () => {
    const onOpen = jest.fn();
    await render(
      <OutboxRow
        entry={{ ...entry, lastError: 'Ціни змінилися', state: 'needs-review' }}
        onOpen={onOpen}
      />,
    );
    await fireEvent.press(screen.getByText('Ціни змінилися'));
    expect(onOpen).toHaveBeenCalled();

    await render(<ReviewBanner onClose={jest.fn()} reason="Ціни змінилися" />);
    expect(screen.getByText('Сервер повернув розрахунок')).toBeTruthy();
  });
});
