import {
  addProduct,
  adjustmentProblem,
  applyOutcome,
  calculationTotals,
  changedPrices,
  clampQuantity,
  formatAdjustment,
  nextDueEntry,
  parseAdjustment,
  priceLine,
  retryDelayMs,
  type LineProduct,
  type OutboxEntry,
} from './index';

const product = (overrides: Partial<LineProduct> = {}): LineProduct => ({
  id: 101,
  name: 'Ручка',
  priceKopecks: 41_200,
  stock: 10,
  ...overrides,
});

describe('adjustment (SC-011, SC-012)', () => {
  it('reads discounts, markups and decimals', () => {
    expect(parseAdjustment('−10')).toEqual({ kind: 'ok', kopecks: -1000 });
    expect(parseAdjustment('5')).toEqual({ kind: 'ok', kopecks: 500 });
    expect(parseAdjustment('+2,5')).toEqual({ kind: 'ok', kopecks: 250 });
    expect(parseAdjustment('')).toEqual({ kind: 'ok', kopecks: 0 });
    expect(parseAdjustment('abc').kind).toBe('invalid');
    expect(formatAdjustment(-1000)).toBe('−10');
    expect(formatAdjustment(250)).toBe('+2,50');
  });

  it('keeps the unit price at 1 ₴ or more and says the largest discount', () => {
    expect(adjustmentProblem(500, -500)).toBe('Ціна не може бути нижче 1 ₴: найбільша знижка −4');
    expect(adjustmentProblem(500, -400)).toBeNull();
    expect(adjustmentProblem(80, -10)).toMatch(/знижка для цього товару неможлива/);
    expect(adjustmentProblem(80, 1000)).toBeNull();
  });
});

describe('lines and totals', () => {
  it('prices a discounted line and sums the adjustment (SC-011)', () => {
    const line = priceLine({ adjustmentKopecks: -1000, productId: 101, quantity: 4 }, product());

    expect(line).toMatchObject({ lineKopecks: 160_800, problem: null, unitKopecks: 40_200 });
    expect(calculationTotals([line])).toEqual({
      adjustmentKopecks: -4000,
      isSendable: true,
      lineCount: 1,
      totalKopecks: 160_800,
    });
  });

  it('marks lines that cannot be sent', () => {
    expect(priceLine({ adjustmentKopecks: 0, productId: 1, quantity: 1 }, null).problem).toBe(
      'missing-product',
    );
    expect(
      priceLine({ adjustmentKopecks: 0, productId: 101, quantity: 1 }, product({ stock: 0 }))
        .problem,
    ).toBe('out-of-stock');
    expect(
      priceLine(
        { adjustmentKopecks: 0, productId: 101, quantity: 1 },
        product({ priceKopecks: null }),
      ).problem,
    ).toBe('no-price');
    expect(
      priceLine({ adjustmentKopecks: 0, productId: 101, quantity: 11 }, product()).message,
    ).toBe('На складі лише 10 шт.');
  });

  it('adds products without passing the stock', () => {
    const one = addProduct([], product({ stock: 1 }));
    expect(addProduct(one, product({ stock: 1 }))).toEqual([
      { adjustmentKopecks: 0, productId: 101, quantity: 1 },
    ]);
    expect(clampQuantity(0, 5)).toBe(1);
    expect(clampQuantity(9, 5)).toBe(5);
  });
});

describe('send queue state (SC-015 to SC-017)', () => {
  const entry = (overrides: Partial<OutboxEntry> = {}): OutboxEntry =>
    ({
      attempts: 0,
      counterpartyId: 'c-1',
      createdAt: 1,
      id: 'e-1',
      idempotencyKey: 'k-1',
      kind: 'order-create',
      lastError: null,
      nextAttemptAt: 0,
      orderNumber: null,
      payload: {} as never,
      review: null,
      state: 'pending',
      ...overrides,
    }) as OutboxEntry;

  it('backs off 5 s, 30 s, 2 min, then every 5 min', () => {
    expect([1, 2, 3, 4, 9].map(retryDelayMs)).toEqual([5_000, 30_000, 120_000, 300_000, 300_000]);
    expect(applyOutcome(entry(), { error: 'network', kind: 'retry' }, 1000)).toMatchObject({
      attempts: 1,
      nextAttemptAt: 6000,
      state: 'pending',
    });
  });

  it('goes back to the manager on a rejection and finishes once sent', () => {
    const review = { changedProductIds: [101], reason: 'Ціни змінилися' };
    expect(applyOutcome(entry(), { kind: 'review', review }, 0)).toMatchObject({
      review,
      state: 'needs-review',
    });
    expect(applyOutcome(entry(), { kind: 'sent', orderNumber: 'K-1' }, 0)).toMatchObject({
      orderNumber: 'K-1',
      state: 'done',
    });
    expect(applyOutcome(entry(), { kind: 'paused' }, 0)).toEqual(entry());
  });

  it('sends the oldest pending entry only when it is due', () => {
    const first = entry({ createdAt: 1, id: 'a', nextAttemptAt: 5000 });
    const second = entry({ createdAt: 2, id: 'b' });
    expect(nextDueEntry([second, first], 1000)).toBeNull();
    expect(nextDueEntry([second, first], 5000)?.id).toBe('a');
    expect(nextDueEntry([entry({ state: 'needs-review' }), second], 0)?.id).toBe('b');
  });

  it('finds changed server prices', () => {
    expect(
      changedPrices({ '101': 41_200, '102': 1000 }, [
        { baseUnitKopecks: 41_200, productId: 101 },
        { baseUnitKopecks: 1100, productId: 102 },
      ]),
    ).toEqual([102]);
  });
});
