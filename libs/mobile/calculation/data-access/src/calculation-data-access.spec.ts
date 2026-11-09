import { createTestLocalDatabase } from '@mobile/core/local-db/testing';

import { WorkspaceError } from './api/workspace-failure';
import { drainOutbox } from './runner/outbox-runner';
import {
  enqueueDraftSave,
  enqueueOrder,
  openDraftInCalculation,
  type QueueEnvironment,
} from './store/calculation-actions';
import { readCalculation, updateCalculation, writeCalculation } from './store/calculation-store';
import { readOutbox } from './store/outbox-store';

import type { OrderWorkspaceApi, ServerQuote } from './api/order-workspace-api';
import type { LocalDatabase } from '@mobile/core/local-db';

const customer = 'cp-1';

function testEnv(start = 1_000_000): QueueEnvironment & { advance: (ms: number) => void } {
  let now = start;
  let id = 0;
  return {
    advance: (ms) => {
      now += ms;
    },
    newId: () => `id-${++id}`,
    now: () => now,
  };
}

function fakeApi(overrides: Partial<OrderWorkspaceApi> = {}): jest.Mocked<OrderWorkspaceApi> {
  const quote: ServerQuote = {
    fingerprint: 'fp-1',
    lines: [{ baseUnitKopecks: 10_000, productId: 7, unitKopecks: 9_000 }],
    totalKopecks: 18_000,
  };
  return {
    createDraft: jest.fn().mockResolvedValue({ draftId: 11, version: 'v1' }),
    createOrder: jest.fn().mockResolvedValue({ orderNumber: 'КД-0042' }),
    deleteDraft: jest.fn().mockResolvedValue(undefined),
    getDraft: jest.fn(),
    quote: jest.fn().mockResolvedValue(quote),
    updateDraft: jest.fn().mockResolvedValue({ draftId: 11, version: 'v2' }),
    ...overrides,
  } as jest.Mocked<OrderWorkspaceApi>;
}

function fillCalculation(
  db: LocalDatabase,
  sourceDraft: { id: number; version: string; title: string } | null = null,
) {
  writeCalculation(db, {
    comment: 'Самовивіз',
    counterpartyId: customer,
    lines: [{ adjustmentKopecks: -1_000, productId: 7, quantity: 2 }],
    review: null,
    sourceDraft,
  });
}

function queueOrder(db: LocalDatabase, env: QueueEnvironment) {
  const { comment, lines } = readCalculation(db, customer);
  return enqueueOrder(
    db,
    {
      comment,
      counterpartyId: customer,
      customerName: 'ТОВ Двері',
      expectedBaseKopecks: { 7: 10_000 },
      lines,
      totalKopecks: 18_000,
    },
    env,
  );
}

describe('calculation store', () => {
  it('keeps lines in order and removes an emptied calculation', () => {
    const db = createTestLocalDatabase();
    fillCalculation(db);
    updateCalculation(db, customer, (current) => ({
      ...current,
      lines: [...current.lines, { adjustmentKopecks: 0, productId: 3, quantity: 1 }],
    }));
    expect(readCalculation(db, customer).lines.map((line) => line.productId)).toEqual([7, 3]);

    updateCalculation(db, customer, (current) => ({ ...current, comment: null, lines: [] }));
    expect(readCalculation(db, customer)).toEqual({
      comment: null,
      counterpartyId: customer,
      lines: [],
      review: null,
      sourceDraft: null,
    });
  });

  it('opens a saved draft with its version for a later save (SC-014)', () => {
    const db = createTestLocalDatabase();
    openDraftInCalculation(db, {
      counterpartyId: customer,
      draftId: 5,
      lines: [{ adjustmentKopecks: 500, productId: 9, quantity: 4 }],
      note: 'До п’ятниці',
      title: 'Об’єкт на Подолі',
      version: 'v3',
    });
    expect(readCalculation(db, customer)).toMatchObject({
      comment: 'До п’ятниці',
      lines: [{ adjustmentKopecks: 500, productId: 9, quantity: 4 }],
      sourceDraft: { id: 5, title: 'Об’єкт на Подолі', version: 'v3' },
    });
  });
});

describe('send queue', () => {
  it('sends a queued order once with its idempotency key and empties the calculation (SC-015)', async () => {
    const db = createTestLocalDatabase();
    const env = testEnv();
    fillCalculation(db);
    const entry = queueOrder(db, env);
    expect(readCalculation(db, customer).lines).toEqual([]);

    const api = fakeApi();
    await expect(drainOutbox(db, api, env)).resolves.toBe('idle');

    expect(api.createOrder).toHaveBeenCalledTimes(1);
    expect(api.createOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        comment: 'Самовивіз',
        counterpartyId: customer,
        quoteFingerprint: 'fp-1',
      }),
      entry.idempotencyKey,
    );
    expect(readOutbox(db)).toEqual([
      expect.objectContaining({ orderNumber: 'КД-0042', state: 'done' }),
    ]);
  });

  it('retries a lost connection with backoff and keeps the same key (SC-016)', async () => {
    const db = createTestLocalDatabase();
    const env = testEnv();
    fillCalculation(db);
    const entry = queueOrder(db, env);
    const api = fakeApi({ quote: jest.fn().mockRejectedValue(new Error('Network Error')) });

    await expect(drainOutbox(db, api, env)).resolves.toBe('waiting');
    expect(readOutbox(db)[0]).toMatchObject({
      attempts: 1,
      nextAttemptAt: env.now() + 5_000,
      state: 'pending',
    });

    // Not due yet: nothing is sent.
    await drainOutbox(db, api, env);
    expect(api.quote).toHaveBeenCalledTimes(1);

    env.advance(5_000);
    api.quote.mockResolvedValue({ fingerprint: 'fp-2', lines: [], totalKopecks: 0 });
    await expect(drainOutbox(db, api, env)).resolves.toBe('idle');
    expect(api.createOrder).toHaveBeenCalledWith(expect.anything(), entry.idempotencyKey);
  });

  it('returns an order with changed prices to the empty calculation (SC-017)', async () => {
    const db = createTestLocalDatabase();
    const env = testEnv();
    fillCalculation(db);
    queueOrder(db, env);
    const api = fakeApi({
      quote: jest.fn().mockResolvedValue({
        fingerprint: 'fp-1',
        lines: [{ baseUnitKopecks: 11_000, productId: 7, unitKopecks: 10_000 }],
        totalKopecks: 20_000,
      }),
    });

    await expect(drainOutbox(db, api, env)).resolves.toBe('idle');

    expect(api.createOrder).not.toHaveBeenCalled();
    expect(readOutbox(db)).toEqual([]);
    expect(readCalculation(db, customer)).toMatchObject({
      comment: 'Самовивіз',
      lines: [{ adjustmentKopecks: -1_000, productId: 7, quantity: 2 }],
      review: { changedProductIds: [7], reason: 'Ціни змінилися, перевірте розрахунок' },
    });
  });

  it('keeps a returned order in the queue when the manager has a new calculation', async () => {
    const db = createTestLocalDatabase();
    const env = testEnv();
    fillCalculation(db);
    queueOrder(db, env);
    fillCalculation(db);
    const api = fakeApi({
      createOrder: jest.fn().mockRejectedValue(
        new WorkspaceError({
          code: 'customer_not_found',
          kind: 'rejected',
          message: 'Клієнта більше немає в 1С',
        }),
      ),
    });

    await drainOutbox(db, api, env);

    expect(readOutbox(db)).toEqual([
      expect.objectContaining({ lastError: 'Клієнта більше немає в 1С', state: 'needs-review' }),
    ]);
    expect(readCalculation(db, customer).review).toBeNull();
  });

  it('pauses without counting an attempt when the session is gone', async () => {
    const db = createTestLocalDatabase();
    const env = testEnv();
    fillCalculation(db);
    queueOrder(db, env);
    const api = fakeApi({
      quote: jest.fn().mockRejectedValue(new WorkspaceError({ kind: 'unauthorized' })),
    });

    await expect(drainOutbox(db, api, env)).resolves.toBe('paused');
    expect(readOutbox(db)[0]).toMatchObject({ attempts: 0, state: 'pending' });
  });

  it('deletes the source draft after its order is created', async () => {
    const db = createTestLocalDatabase();
    const env = testEnv();
    fillCalculation(db, { id: 5, title: 'Подол', version: 'v3' });
    queueOrder(db, env);
    const api = fakeApi();

    await drainOutbox(db, api, env);

    expect(api.deleteDraft).toHaveBeenCalledWith(5, 'v3');
    expect(readOutbox(db).map((entry) => entry.kind)).toEqual(['order-create']);
  });

  it('creates a new draft or replaces the opened one by its version (SC-013, SC-014)', async () => {
    const db = createTestLocalDatabase();
    const env = testEnv();
    const api = fakeApi();

    fillCalculation(db);
    const created = enqueueDraftSave(db, customer, 'Новий об’єкт', env);
    expect(readCalculation(db, customer).lines).toEqual([]);
    const delivered = jest.fn();
    await drainOutbox(db, api, env, delivered);
    // The customer's draft list refreshes once the server has the draft.
    expect(delivered).toHaveBeenCalledWith(
      expect.objectContaining({ counterpartyId: customer, kind: 'draft-save' }),
    );
    expect(api.createDraft).toHaveBeenCalledWith(
      expect.objectContaining({ note: 'Самовивіз', title: 'Новий об’єкт' }),
      created.idempotencyKey,
    );

    fillCalculation(db, { id: 5, title: 'Подол', version: 'v3' });
    enqueueDraftSave(db, customer, 'Подол', env);
    await drainOutbox(db, api, env);
    expect(api.updateDraft).toHaveBeenCalledWith(
      5,
      'v3',
      expect.objectContaining({ title: 'Подол' }),
    );
    expect(readOutbox(db)).toEqual([]);
  });

  it('returns a draft changed on another device with the server reason', async () => {
    const db = createTestLocalDatabase();
    const env = testEnv();
    fillCalculation(db, { id: 5, title: 'Подол', version: 'v3' });
    enqueueDraftSave(db, customer, 'Подол', env);
    const api = fakeApi({
      updateDraft: jest.fn().mockRejectedValue(
        new WorkspaceError({
          code: 'version_conflict',
          kind: 'rejected',
          message: 'Чернетку змінили на іншому пристрої',
        }),
      ),
    });

    await drainOutbox(db, api, env);

    expect(readCalculation(db, customer)).toMatchObject({
      review: { reason: 'Чернетку змінили на іншому пристрої' },
      sourceDraft: { id: 5, title: 'Подол', version: 'v3' },
    });
  });
});
