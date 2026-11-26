import { redirectLookupKey, redirectTarget, toRedirectMap } from './redirect-lookup';

const site = 'https://classkedr.com.ua/uk/old-page?utm=1';

describe('redirectLookupKey', () => {
  it('matches the key the backend stores', () => {
    expect(redirectLookupKey('/UK/Old-Page/')).toBe('/uk/old-page');
    expect(redirectLookupKey('/uk/%D0%BF%D0%B5%D1%82%D0%BB%D1%96?x=1')).toBe('/uk/петлі');
    expect(redirectLookupKey('/uk/%E0%A4%A')).toBe('/uk/%e0%a4%a');
    expect(redirectLookupKey('/')).toBe('/');
  });
});

describe('toRedirectMap', () => {
  it('skips malformed rows and refuses a malformed answer', () => {
    const map = toRedirectMap([{ from: '/uk/old', to: '/uk/new' }, { from: 1 }]);
    expect([...map]).toEqual([['/uk/old', '/uk/new']]);
    expect(() => toRedirectMap({ items: [] })).toThrow();
  });
});

describe('redirectTarget', () => {
  const map = toRedirectMap([
    { from: '/uk/old-page', to: '/uk/new-page?tab=1' },
    { from: '/uk/away', to: 'https://example.com/x' },
    { from: '/uk/loop', to: '/UK/Loop/' },
  ]);

  it('resolves a site path and keeps its own query', () => {
    expect(redirectTarget(map, '/uk/Old-Page/', site)?.toString()).toBe(
      'https://classkedr.com.ua/uk/new-page?tab=1',
    );
  });

  it('resolves a full address', () => {
    expect(redirectTarget(map, '/uk/away', site)?.toString()).toBe('https://example.com/x');
  });

  it('ignores unknown addresses and a redirect to itself', () => {
    expect(redirectTarget(map, '/uk/other', site)).toBeNull();
    expect(redirectTarget(map, '/uk/loop', site)).toBeNull();
  });
});
