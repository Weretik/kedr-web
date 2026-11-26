import { describe, expect, it } from 'vitest';

import {
  readSiteQueueState,
  readSiteReviewTab,
  writeSiteReviewState,
} from './site-review-url-state';

describe('«Перевірка» address', () => {
  it('reads the tab, «Нові моделі» by default', () => {
    expect(readSiteReviewTab(new URLSearchParams('tab=lone'))).toBe('lone');
    expect(readSiteReviewTab(new URLSearchParams('tab=codes'))).toBe('codes');
    expect(readSiteReviewTab(new URLSearchParams('tab=nope'))).toBe('new');
    expect(readSiteReviewTab(new URLSearchParams())).toBe('new');
  });

  it('reads the queue of «Нові моделі»: category, search, and the open model', () => {
    expect(
      readSiteQueueState(new URLSearchParams('tab=new&categoryId=11&search=%20rio%20&item=m5')),
    ).toEqual({ categoryId: 11, search: 'rio', item: 'm5' });
    expect(readSiteQueueState(new URLSearchParams('categoryId=-1&item=p5'))).toEqual({
      categoryId: undefined,
      search: undefined,
      item: undefined,
    });
  });

  it('writes the tab first and only the queue values that are set', () => {
    expect(writeSiteReviewState('new', { categoryId: 11, item: 'm5' }).toString()).toBe(
      'tab=new&categoryId=11&item=m5',
    );
    expect(writeSiteReviewState('lone').toString()).toBe('tab=lone');
  });
});
