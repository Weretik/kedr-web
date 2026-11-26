import { describe, expect, it } from 'vitest';

import { readSiteModelPanel, siteModelPanelKey, writeSiteModelPanel } from './site-model-panel-url';

describe('site model panel URL', () => {
  it.each([
    ['edit-5', { kind: 'edit', modelId: 5 }],
    ['new', { kind: 'new' }],
    ['add-m7', { kind: 'add', target: { modelId: 7 } }],
    ['add-p11', { kind: 'add', target: { productId: 11 } }],
  ])('reads %s', (value, panel) => {
    expect(readSiteModelPanel(new URLSearchParams({ panel: value }))).toEqual(panel);
  });

  it.each(['', 'edit-x', 'add-q3', 'other'])('ignores %s', (value) => {
    expect(readSiteModelPanel(new URLSearchParams({ panel: value }))).toBeUndefined();
  });

  it('writes a panel and keeps the other params', () => {
    const params = new URLSearchParams('search=a');
    expect(writeSiteModelPanel(params, { kind: 'edit', modelId: 3 }).toString()).toBe(
      'search=a&panel=edit-3',
    );
    expect(
      writeSiteModelPanel(params, { kind: 'add', target: { productId: 4 } }).get('panel'),
    ).toBe('add-p4');
    expect(writeSiteModelPanel(params, { kind: 'new' }).get('panel')).toBe('new');
  });

  it('removes the panel on close', () => {
    expect(writeSiteModelPanel(new URLSearchParams('panel=new&page=2'), undefined).toString()).toBe(
      'page=2',
    );
  });

  it('gives each panel its key', () => {
    expect(siteModelPanelKey({ kind: 'add', target: { modelId: 2 } })).toBe('add-m2');
    expect(siteModelPanelKey({ kind: 'edit', modelId: 2 })).toBe('edit-2');
  });
});
