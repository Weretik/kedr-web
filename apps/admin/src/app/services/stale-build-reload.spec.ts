import { describe, expect, it, vi } from 'vitest';

import { reloadOnStaleBuild } from './stale-build-reload';

const fakeWindow = () => {
  const target = new EventTarget() as EventTarget & {
    sessionStorage: Storage;
    location: { reload: () => void };
  };
  const store = new Map<string, string>();
  target.sessionStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
  } as Storage;
  target.location = { reload: vi.fn() };
  return target;
};

describe('reloadOnStaleBuild', () => {
  it('reloads once when a page file of an old build cannot load', () => {
    const target = fakeWindow();
    reloadOnStaleBuild(target as unknown as Window);

    const first = new Event('vite:preloadError', { cancelable: true });
    target.dispatchEvent(first);
    target.dispatchEvent(new Event('vite:preloadError', { cancelable: true }));

    expect(first.defaultPrevented).toBe(true);
    expect(target.location.reload).toHaveBeenCalledOnce();
  });
});
