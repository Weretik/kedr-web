import { createRedirectList } from './redirect-list';

const ok = (body: unknown) =>
  new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } });

describe('createRedirectList', () => {
  let time = 0;
  const now = () => time;

  beforeEach(() => {
    time = 0;
  });

  it('loads once and serves the copy until it is stale', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(ok([{ from: '/uk/a', to: '/uk/b' }]));
    const list = createRedirectList({ apiUrl: 'https://api', fetchImpl, now });

    expect((await list.get()).get('/uk/a')).toBe('/uk/b');
    time = 60_000;
    await list.get();

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchImpl.mock.calls[0]?.[0]).toBe('https://api/api/content/redirects');
  });

  it('answers a stale copy at once and refreshes it in the background', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(ok([{ from: '/uk/a', to: '/uk/b' }]))
      .mockResolvedValueOnce(ok([{ from: '/uk/a', to: '/uk/c' }]));
    const list = createRedirectList({ apiUrl: 'https://api', fetchImpl, now });
    await list.get();

    time = 5 * 60_000;
    const background: Promise<unknown>[] = [];
    expect((await list.get((promise) => background.push(promise))).get('/uk/a')).toBe('/uk/b');
    await Promise.all(background);

    expect((await list.get()).get('/uk/a')).toBe('/uk/c');
  });

  it('keeps the last copy when the API fails and tries again later', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(ok([{ from: '/uk/a', to: '/uk/b' }]))
      .mockResolvedValueOnce(new Response('', { status: 503 }));
    const list = createRedirectList({ apiUrl: 'https://api', fetchImpl, now });
    await list.get();

    time = 5 * 60_000;
    const background: Promise<unknown>[] = [];
    await list.get((promise) => background.push(promise));
    await Promise.all(background);
    time += 10_000;

    expect((await list.get()).get('/uk/a')).toBe('/uk/b');
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('serves no redirects when the first load fails', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('offline'));
    const list = createRedirectList({ apiUrl: 'https://api', fetchImpl, now });

    expect((await list.get()).size).toBe(0);
  });

  // Cloudflare Workers: a promise that belongs to another request (for example a prefetch the browser
  // cancelled) can never settle in this one, so a request must never wait for another request's load.
  it('does not make a request wait for a load started by another request', async () => {
    const fetchImpl = vi
      .fn()
      .mockReturnValueOnce(new Promise<Response>(() => undefined))
      .mockResolvedValueOnce(ok([{ from: '/uk/a', to: '/uk/b' }]));
    const list = createRedirectList({ apiUrl: 'https://api', fetchImpl, now });

    void list.get();

    expect((await list.get()).get('/uk/a')).toBe('/uk/b');
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('hands a background refresh only to the request that started it', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(ok([{ from: '/uk/a', to: '/uk/b' }]))
      .mockReturnValueOnce(new Promise<Response>(() => undefined))
      .mockResolvedValueOnce(ok([{ from: '/uk/a', to: '/uk/c' }]));
    const list = createRedirectList({ apiUrl: 'https://api', fetchImpl, now, timeoutMs: 1_500 });
    await list.get();

    time = 5 * 60_000;
    const first: Promise<unknown>[] = [];
    const second: Promise<unknown>[] = [];
    await list.get((promise) => first.push(promise));
    await list.get((promise) => second.push(promise));

    expect(first).toHaveLength(1);
    expect(second).toHaveLength(0);
    expect(fetchImpl).toHaveBeenCalledTimes(2);

    time += 1_500;
    const third: Promise<unknown>[] = [];
    await list.get((promise) => third.push(promise));
    await Promise.all(third);

    expect((await list.get()).get('/uk/a')).toBe('/uk/c');
  });
});
