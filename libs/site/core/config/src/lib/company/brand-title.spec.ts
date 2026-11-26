import { TITLE_MAX_LENGTH, pageTitle, withoutBrand } from './brand-title';

describe('title policy', () => {
  it('removes a brand the editor already wrote, so the template adds it once', () => {
    expect(withoutBrand('Замки | ClassKedr')).toBe('Замки');
    expect(withoutBrand('Замки — Class Kedr | ClassKedr')).toBe('Замки');
    expect(withoutBrand('Ручки Class Kedr для дверей')).toBe('Ручки Class Kedr для дверей');
  });

  it('keeps the brand template when the whole title fits the limit', () => {
    expect(pageTitle('Завіси врізні | ClassKedr')).toBe('Завіси врізні');
  });

  it('drops the brand when the title with it would be longer than the limit', () => {
    const long = 'Завіси врізні для міжкімнатних дверей — купити оптом';
    expect(long.length + ' | Class Kedr'.length).toBeGreaterThan(TITLE_MAX_LENGTH);
    expect(pageTitle(long)).toEqual({ absolute: long });
  });
});
