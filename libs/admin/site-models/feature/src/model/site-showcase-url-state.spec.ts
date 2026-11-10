import { describe, expect, it } from 'vitest';

import {
  legacySiteShowcasePath,
  readSiteQueueState,
  readSiteShowcaseTab,
  writeSiteQueueState,
} from './site-showcase-url-state';

describe('«Вітрина сайту» address', () => {
  it('reads the tab, «Моделі» by default', () => {
    expect(readSiteShowcaseTab(new URLSearchParams('tab=codes'))).toBe('codes');
    expect(readSiteShowcaseTab(new URLSearchParams('tab=nope'))).toBe('models');
  });

  it('reads and writes the queue', () => {
    const state = readSiteQueueState(
      new URLSearchParams('view=problems&categoryId=11&search=%20rio%20&item=m5'),
    );
    expect(state).toEqual({ view: 'problems', categoryId: 11, search: 'rio', item: 'm5' });
    expect(writeSiteQueueState(state).toString()).toBe(
      'view=problems&categoryId=11&search=rio&item=m5',
    );
    expect(writeSiteQueueState({ view: 'all' }).toString()).toBe('');
    expect(writeSiteQueueState({ view: 'review' }).toString()).toBe('view=review');
    expect(readSiteQueueState(new URLSearchParams()).view).toBe('all');
    expect(readSiteQueueState(new URLSearchParams('item=x1')).item).toBeUndefined();
  });

  it('keeps the filters of the old pages', () => {
    expect(readSiteQueueState(new URLSearchParams('problem=no_model')).view).toBe('lone');
    expect(readSiteQueueState(new URLSearchParams('problem=any')).view).toBe('problems');
    expect(readSiteQueueState(new URLSearchParams('status=proposed')).view).toBe('review');
  });

  it('sends old addresses to the new page', () => {
    expect(
      legacySiteShowcasePath('models', new URLSearchParams('status=accepted&problem=any')),
    ).toBe('/site-showcase?view=problems');
    expect(legacySiteShowcasePath('model', new URLSearchParams(), '42')).toBe(
      '/site-showcase?item=m42',
    );
    expect(legacySiteShowcasePath('attributes', new URLSearchParams('tab=filters'))).toBe(
      '/site-showcase?tab=filters',
    );
    expect(legacySiteShowcasePath('attributes', new URLSearchParams())).toBe(
      '/site-showcase?tab=attributes',
    );
  });
});
