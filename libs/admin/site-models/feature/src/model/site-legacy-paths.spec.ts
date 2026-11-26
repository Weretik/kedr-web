import { describe, expect, it } from 'vitest';

import { legacyCatalogAttributesPath, legacySiteShowcasePath } from './site-legacy-paths';

const showcase = (search: string) => legacySiteShowcasePath(new URLSearchParams(search));

describe('old «Вітрина сайту» addresses', () => {
  it('opens «Моделі» without a tab and keeps its category and search', () => {
    expect(showcase('')).toBe('/site-models');
    expect(showcase('view=all&categoryId=11&search=rio')).toBe(
      '/site-models?categoryId=11&search=rio',
    );
    expect(showcase('tab=models')).toBe('/site-models');
  });

  it('sends the queue views to «Перевірка» and problems to the list', () => {
    expect(showcase('view=review&categoryId=11')).toBe('/site-review?tab=new');
    expect(showcase('view=lone')).toBe('/site-review?tab=lone');
    expect(showcase('view=problems&categoryId=11')).toBe('/site-models?categoryId=11&problem=any');
  });

  it('opens a model page for an open model and the lone tab for an open product', () => {
    expect(showcase('view=review&item=m42')).toBe('/site-models/42');
    expect(showcase('item=p7')).toBe('/site-review?tab=lone');
    expect(showcase('item=mx')).toBe('/site-models');
  });

  it('sends the dictionary tabs to their new pages', () => {
    expect(showcase('tab=attributes')).toBe('/site-attributes?tab=attributes');
    expect(showcase('tab=filters')).toBe('/site-attributes?tab=filters');
    expect(showcase('tab=codes')).toBe('/site-review?tab=codes');
  });
});

describe('old «Ознаки» addresses', () => {
  it('open «Ознаки та фільтри», and the codes «Перевірка»', () => {
    expect(legacyCatalogAttributesPath(new URLSearchParams())).toBe(
      '/site-attributes?tab=attributes',
    );
    expect(legacyCatalogAttributesPath(new URLSearchParams('tab=filters'))).toBe(
      '/site-attributes?tab=filters',
    );
    expect(legacyCatalogAttributesPath(new URLSearchParams('tab=codes'))).toBe(
      '/site-review?tab=codes',
    );
  });
});
