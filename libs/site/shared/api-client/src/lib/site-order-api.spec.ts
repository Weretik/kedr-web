import { siteApiCreateQuickOrder } from './site-order-api';

vi.mock('server-only', () => ({}));

const command = {
  firstName: 'Ірина',
  phone: '+38 (050) 123-45-67',
  lines: [{ productId: '731', title: 'Ручка', unitPrice: 120.5, quantity: 2 }],
};

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('siteApiCreateQuickOrder', () => {
  afterEach(() => vi.restoreAllMocks());

  it('sends one JSON POST only to the fixed order endpoint, without session or shared caching', async () => {
    const body = { orderId: '550e8400-e29b-41d4-a716-446655440000' };
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, body));
    const timeout = vi.spyOn(AbortSignal, 'timeout');

    const result = await siteApiCreateQuickOrder(
      command,
      {},
      fetchMock,
      'https://api.example.com/base',
    );

    expect(result).toEqual({ kind: 'response', status: 200, body });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(url.toString()).toBe('https://api.example.com/api/orders');
    expect(options).toMatchObject({
      method: 'POST',
      cache: 'no-store',
      credentials: 'omit',
      redirect: 'error',
      body: JSON.stringify(command),
    });
    const headers = new Headers(options.headers);
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('Accept')).toBe('application/json');
    expect(headers.has('Authorization')).toBe(false);
    expect(headers.has('Cookie')).toBe(false);
    expect(timeout).toHaveBeenCalledWith(10_000);
    expect(options.signal).toBeDefined();
  });

  it.each([400, 409, 503])(
    'keeps HTTP %i and an unknown JSON body for the domain parser',
    async (status) => {
      const body = ['backend message'];
      const fetchMock = vi.fn().mockResolvedValue(jsonResponse(status, body));

      expect(
        await siteApiCreateQuickOrder(command, {}, fetchMock, 'https://api.example.com'),
      ).toEqual({
        kind: 'response',
        status,
        body,
      });
      expect(fetchMock).toHaveBeenCalledTimes(1);
    },
  );

  it.each([
    new Response('<html>Upstream stack</html>', {
      status: 502,
      headers: { 'Content-Type': 'text/html' },
    }),
    new Response('{broken', { status: 200, headers: { 'Content-Type': 'application/json' } }),
    new Response(null, { status: 400 }),
  ])('does not expose malformed or non-JSON response text', async (response) => {
    const fetchMock = vi.fn().mockResolvedValue(response);

    expect(
      await siteApiCreateQuickOrder(command, {}, fetchMock, 'https://api.example.com'),
    ).toEqual({
      kind: 'response',
      status: response.status,
      body: undefined,
    });
  });

  it.each([new TypeError('network secret'), new DOMException('expired', 'TimeoutError')])(
    'does not retry or expose a failed request',
    async (error) => {
      const fetchMock = vi.fn().mockRejectedValue(error);

      expect(
        await siteApiCreateQuickOrder(command, {}, fetchMock, 'https://api.example.com'),
      ).toEqual({
        kind: 'unavailable',
      });
      expect(fetchMock).toHaveBeenCalledTimes(1);
    },
  );

  it('supports an explicit controlled timeout while keeping the fixed endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, {}));
    const timeout = vi.spyOn(AbortSignal, 'timeout');

    await siteApiCreateQuickOrder(
      command,
      { timeoutMs: 200 },
      fetchMock,
      'https://api.example.com',
    );

    expect(timeout).toHaveBeenCalledWith(200);
  });
});
