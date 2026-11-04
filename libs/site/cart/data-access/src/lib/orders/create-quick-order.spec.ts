import { siteApiCreateQuickOrder } from '@site/shared/api-client';

import { createQuickOrder } from './create-quick-order';

import type { CheckoutCommand } from '@site/cart/model';

vi.mock('server-only', () => ({}));
vi.mock('@site/shared/api-client', () => ({ siteApiCreateQuickOrder: vi.fn() }));

const transport = vi.mocked(siteApiCreateQuickOrder);
const orderId = '550e8400-e29b-41d4-a716-446655440000';
const command: CheckoutCommand = {
  firstName: 'Ірина',
  phone: '+38 (050) 123-45-67',
  lines: [{ productId: '731', title: 'Ручка', unitPrice: 120.5, quantity: 2 }],
};

const response = (status: number, body: unknown) => {
  transport.mockResolvedValue({ kind: 'response', status, body });
  return createQuickOrder(command);
};

describe('createQuickOrder', () => {
  beforeEach(() => {
    transport.mockReset();
  });

  it('maps only order contract fields and confirms only the returned UUID', async () => {
    transport.mockResolvedValue({
      kind: 'response',
      status: 200,
      body: { orderId, secret: 'ignored' },
    });
    const input = {
      ...command,
      firstName: '  Ірина  ',
      locale: 'uk',
      lines: [
        {
          ...command.lines[0],
          slug: 'ruchka',
          currency: 'UAH',
          imageUrl: 'https://example.com/p.jpg',
        },
      ],
    };

    expect(await createQuickOrder(input)).toEqual({ kind: 'created', orderId });
    expect(transport).toHaveBeenCalledExactlyOnceWith(command);
  });

  it.each([
    { ...command, firstName: '' },
    { ...command, phone: '+380501234567' },
    { ...command, lines: [] },
    { ...command, lines: [{ ...command.lines[0], quantity: 1001 }] },
    { ...command, lines: [{ ...command.lines[0], unitPrice: 0 }] },
  ])('rejects invalid input without forwarding a POST', async (input) => {
    expect(await createQuickOrder(input)).toMatchObject({ kind: 'validation' });
    expect(transport).not.toHaveBeenCalled();
  });

  it('maps only known Problem Details fields to bounded plain field errors', async () => {
    expect(
      await response(400, {
        errors: {
          FirstName: ['Перевірте ім’я'],
          phone: ['Перевірте номер'],
          email: ['Unknown field'],
        },
        title: '<html>private stack</html>',
      }),
    ).toEqual({
      kind: 'validation',
      fieldErrors: { firstName: ['Перевірте ім’я'], phone: ['Перевірте номер'] },
      messages: [],
    });
  });

  it.each([
    { body: [{ identifier: 'firstName', errorMessage: 'Перевірте ім’я' }] },
    { body: [{ Identifier: 'FirstName', ErrorMessage: 'Перевірте ім’я' }] },
  ])(
    'recognizes existing Ardalis normalization shapes without inventing a 400 schema',
    async ({ body }) => {
      expect(await response(400, body)).toEqual({
        kind: 'validation',
        fieldErrors: { firstName: ['Перевірте ім’я'] },
        messages: [],
      });
    },
  );

  it.each([
    undefined,
    null,
    'raw backend text',
    '<html>private</html>',
    { other: 'unknown' },
    [{ identifier: 'email', errorMessage: 'Unknown field' }],
  ])('keeps an opaque validation body as a localized global fallback', async (body) => {
    expect(await response(400, body)).toEqual({
      kind: 'validation',
      fieldErrors: {},
      messages: [],
    });
  });

  it('drops markup, stack-like, overlong and control-character errors', async () => {
    expect(
      await response(400, {
        errors: {
          phone: [
            '<b>private</b>',
            'System.InvalidOperationException',
            'TypeError: secret',
            'first\nsecond',
            'x'.repeat(501),
          ],
        },
      }),
    ).toEqual({ kind: 'validation', fieldErrors: {}, messages: [] });
  });

  it('deduplicates and bounds server field messages', async () => {
    expect(
      await response(400, { errors: { phone: ['one', 'one', 'two', 'three', 'four', 'five'] } }),
    ).toEqual({
      kind: 'validation',
      fieldErrors: { phone: ['one', 'two', 'three', 'four'] },
      messages: [],
    });
  });

  it('keeps a confirmed business conflict without inventing its cause', async () => {
    expect(
      await response(409, [
        'Потрібне уточнення',
        '<script>secret</script>',
        'at OrderController.Create (orders.ts:10:2)',
      ]),
    ).toEqual({ kind: 'conflict', messages: ['Потрібне уточнення'] });
    expect(transport).toHaveBeenCalledTimes(1);
  });

  it.each([
    { body: null },
    { body: { message: 'unknown' } },
    { body: ['message', { secret: true }] },
  ])(
    'does not treat an invalid conflict body as a confirmed contract response',
    async ({ body }) => {
      expect(await response(409, body)).toEqual({ kind: 'uncertain', messages: [] });
    },
  );

  it.each([undefined, null, {}, { orderId: 'not-a-uuid' }, { orderId: 123 }])(
    'does not clear the order on malformed HTTP 200',
    async (body) => {
      expect(await response(200, body)).toEqual({ kind: 'uncertain', messages: [] });
    },
  );

  it.each([201, 401, 404, 500, 503])(
    'treats HTTP %i as uncertain without retrying',
    async (status) => {
      expect(await response(status, { secret: 'not exposed' })).toEqual({
        kind: 'uncertain',
        messages: [],
      });
      expect(transport).toHaveBeenCalledTimes(1);
    },
  );

  it('preserves uncertainty after an unavailable or unexpectedly thrown transport', async () => {
    transport.mockResolvedValueOnce({ kind: 'unavailable' });
    expect(await createQuickOrder(command)).toEqual({ kind: 'uncertain', messages: [] });
    transport.mockRejectedValueOnce(new Error('private stack'));
    expect(await createQuickOrder(command)).toEqual({ kind: 'uncertain', messages: [] });
    expect(transport).toHaveBeenCalledTimes(2);
  });
});
