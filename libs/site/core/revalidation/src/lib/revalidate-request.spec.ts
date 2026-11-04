import { handleRevalidateRequest, REVALIDATE_SECRET_HEADER } from './revalidate-request';

const request = (body: unknown, secret?: string) =>
  new Request('https://classkedr.com.ua/api/revalidate', {
    method: 'POST',
    headers: secret ? { [REVALIDATE_SECRET_HEADER]: secret } : {},
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

describe('handleRevalidateRequest', () => {
  it('drops each requested tag once with the right secret', async () => {
    const revalidate = vi.fn();

    const response = await handleRevalidateRequest(
      request({ tags: ['content', 'catalog', 'content'] }, 's3cret'),
      { secret: 's3cret', revalidate },
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ revalidated: ['content', 'catalog'] });
    expect(revalidate.mock.calls).toEqual([['content'], ['catalog']]);
  });

  it.each([
    ['no secret on the site', null, 's3cret', { tags: ['content'] }, 503],
    ['a missing secret', 's3cret', undefined, { tags: ['content'] }, 401],
    ['a wrong secret', 's3cret', 's3creT', { tags: ['content'] }, 401],
    ['a longer secret', 's3cret', 's3cret!', { tags: ['content'] }, 401],
    ['an unknown tag', 's3cret', 's3cret', { tags: ['content', 'cart'] }, 400],
    ['no tags', 's3cret', 's3cret', { tags: [] }, 400],
    ['a broken body', 's3cret', 's3cret', '{', 400],
  ] as const)('refuses %s', async (_case, secret, given, body, status) => {
    const revalidate = vi.fn();

    const response = await handleRevalidateRequest(request(body, given), { secret, revalidate });

    expect(response.status).toBe(status);
    expect(revalidate).not.toHaveBeenCalled();
  });
});
