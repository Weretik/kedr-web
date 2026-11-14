import { describe, expect, it } from 'vitest';

import { mediaScopeFromValue, mediaScopeValue } from './media-scope-value';

describe('media scope select value', () => {
  it('round-trips the whole library, the root, and a folder', () => {
    for (const scope of [
      { kind: 'all' },
      { kind: 'root' },
      { kind: 'folder', folderId: 12 },
    ] as const)
      expect(mediaScopeFromValue(mediaScopeValue(scope))).toEqual(scope);
    expect(mediaScopeValue({ kind: 'folder', folderId: 12 })).toBe('12');
  });
});
