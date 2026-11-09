import {
  calculationTotals,
  priceLine,
  type OutboxEntry,
  LineProduct,
} from '@mobile/calculation/model';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { CalculationFooter } from './components/calculation-footer';
import { CalculationLineRow } from './components/calculation-line-row';
import { LineEditor } from './components/line-editor';
import { OutboxRow } from './components/outbox-row';
import { ReviewBanner } from './components/review-banner';
import { UndoBar } from './components/undo-bar';

const product: LineProduct = {
  id: 7,
  name: 'Петля дверна',
  priceKopecks: 41_200,
  stock: 10,
};

const editorHandlers = () => ({
  onChangeAdjustment: jest.fn(),
  onChangeQuantity: jest.fn(),
  onDone: jest.fn(),
  onRemove: jest.fn(),
});

describe('CalculationLineRow', () => {
  it('shows quantity × price, the line amount and the per-piece mark (SC-011)', async () => {
    const line = priceLine({ adjustmentKopecks: -1_000, productId: 7, quantity: 4 }, product);
    await render(<CalculationLineRow line={line} onOpen={jest.fn()} onRemove={jest.fn()} />);

    expect(screen.getByText(/Код 7 · 4 × 402,00/)).toBeTruthy();
    expect(screen.getByText(/1\s?608,00/)).toBeTruthy();
    expect(screen.getByText('−10/шт')).toBeTruthy();
  });

  it('opens the line on a tap and removes it from the swipe action', async () => {
    const onOpen = jest.fn();
    const onRemove = jest.fn();
    const line = priceLine({ adjustmentKopecks: 0, productId: 7, quantity: 1 }, product);
    await render(<CalculationLineRow line={line} onOpen={onOpen} onRemove={onRemove} />);

    await fireEvent.press(screen.getByRole('button', { name: /^Петля дверна, 1 × / }));
    expect(onOpen).toHaveBeenCalledWith(7);
    await fireEvent.press(screen.getByRole('button', { name: 'Прибрати Петля дверна' }));
    expect(onRemove).toHaveBeenCalledWith(7);
  });

  it('marks a line the server changed and a line with a problem', async () => {
    const line = priceLine(
      { adjustmentKopecks: -500, productId: 7, quantity: 1 },
      { ...product, priceKopecks: 500 },
    );
    await render(
      <CalculationLineRow changed line={line} onOpen={jest.fn()} onRemove={jest.fn()} />,
    );

    expect(screen.getByText('змінено на сервері')).toBeTruthy();
    expect(screen.getByText('Ціна не може бути нижче 1 ₴: найбільша знижка −4')).toBeTruthy();
  });
});

describe('LineEditor', () => {
  it('turns the sign switch and the amount into a per-piece adjustment', async () => {
    const props = editorHandlers();
    const line = priceLine({ adjustmentKopecks: 0, productId: 7, quantity: 1 }, product);
    await render(<LineEditor line={line} {...props} />);
    const field = screen.getByLabelText('Знижка або націнка, гривень за штуку: Петля дверна');

    await fireEvent.changeText(field, '5');
    expect(props.onChangeAdjustment).toHaveBeenLastCalledWith(500);

    await fireEvent.press(screen.getByRole('tab', { name: 'Знижка −' }));
    expect(props.onChangeAdjustment).toHaveBeenLastCalledWith(-500);

    await fireEvent.changeText(field, 'abc');
    expect(screen.getByText('Введіть суму в гривнях, наприклад −10 або 5')).toBeTruthy();
  });

  it('opens with the saved discount, shows the floor and the line amount (SC-012)', async () => {
    const line = priceLine({ adjustmentKopecks: -1_000, productId: 7, quantity: 4 }, product);
    await render(<LineEditor line={line} {...editorHandlers()} />);

    expect(screen.getByDisplayValue('10')).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Знижка −', selected: true })).toBeTruthy();
    expect(screen.getByText('Найбільша знижка −411 грн: ціна не нижче 1 грн')).toBeTruthy();
    expect(screen.getByText(/1\s?608,00/)).toBeTruthy();
  });

  it('changes the quantity, closes and removes', async () => {
    const props = editorHandlers();
    const line = priceLine({ adjustmentKopecks: 0, productId: 7, quantity: 2 }, product);
    await render(<LineEditor line={line} {...props} />);

    await fireEvent.press(
      screen.getByRole('button', { name: 'Збільшити кількість: Петля дверна' }),
    );
    expect(props.onChangeQuantity).toHaveBeenCalledWith(3);
    await fireEvent.press(screen.getByRole('button', { name: 'Готово' }));
    expect(props.onDone).toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Прибрати з розрахунку' }));
    expect(props.onRemove).toHaveBeenCalled();
  });
});

describe('CalculationFooter', () => {
  it('sums lines and pieces, shows the total, and stops sending a line with a problem', async () => {
    const good = priceLine({ adjustmentKopecks: -1_000, productId: 7, quantity: 4 }, product);
    const onSend = jest.fn();
    const { rerender } = await render(
      <CalculationFooter
        onSaveDraft={jest.fn()}
        onSend={onSend}
        totals={calculationTotals([good])}
      />,
    );
    expect(screen.getByText(/1 позиція · 4 шт · знижка −40,00/)).toBeTruthy();
    expect(screen.getByLabelText(/Разом 1\s?608,00/)).toBeTruthy();
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
    expect(screen.getByRole('button', { name: 'Чернетка' })).toBeDisabled();
    expect(screen.getByText('Виправте позначені рядки')).toBeTruthy();
  });

  it('undoes from the undo bar', async () => {
    const onUndo = jest.fn();
    await render(<UndoBar message="Прибрано «Петля дверна»" onUndo={onUndo} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Скасувати' }));
    expect(onUndo).toHaveBeenCalled();
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
