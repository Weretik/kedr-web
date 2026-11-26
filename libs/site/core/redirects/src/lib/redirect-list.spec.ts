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
});
