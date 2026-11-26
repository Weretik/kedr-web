import { describe, expect, it } from 'vitest';

import { readSiteAttributesTab } from './site-page-tabs';

describe('«Ознаки та фільтри» address', () => {
  it('reads the tab, «Ознаки» by default', () => {
    expect(readSiteAttributesTab(new URLSearchParams('tab=filters'))).toBe('filters');
    expect(readSiteAttributesTab(new URLSearchParams('tab=codes'))).toBe('attributes');
    expect(readSiteAttributesTab(new URLSearchParams())).toBe('attributes');
  });
});
