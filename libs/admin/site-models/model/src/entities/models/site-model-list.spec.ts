import { describe, expect, it } from 'vitest';

import { oneCCategoriesNote } from './site-model-list';

describe('site model list', () => {
  it('names the 1C categories that differ from the site category', () => {
    expect(oneCCategoriesNote(['Ручки дверні', 'Накладки'])).toBe('У 1С: Ручки дверні, Накладки');
  });

  it('says nothing when 1C agrees with the site', () => {
    expect(oneCCategoriesNote([])).toBe('');
  });
});
