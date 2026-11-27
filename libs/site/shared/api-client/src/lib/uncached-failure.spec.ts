import { SiteApiUnavailableError, readWithoutCachingFailure } from './uncached-failure';

describe('readWithoutCachingFailure', () => {
  beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => undefined));
  afterEach(() => vi.restoreAllMocks());

  it('returns what the read returns', async () => {
    expect(await readWithoutCachingFailure(async () => 'ok', 'unavailable')).toBe('ok');
    expect(console.error).not.toHaveBeenCalled();
  });

  it('answers unavailable and logs the reason when the read throws', async () => {
    const read = async () => {
      throw new SiteApiUnavailableError('/api/catalog/{lang}/product/{productSlug}');
    };

    expect(await readWithoutCachingFailure(read, 'unavailable')).toBe('unavailable');
    expect(console.error).toHaveBeenCalledWith('Site data read failed', {
      name: 'SiteApiUnavailableError',
      message: 'Site API unavailable: /api/catalog/{lang}/product/{productSlug}',
    });
  });
});
