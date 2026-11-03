import { isValidProductSlug, productPath } from './product-paths';

describe('product path contract', () => {
  it('keeps the flat route already linked from catalog cards', () => {
    expect(productPath('ruchka-731')).toBe('/product/ruchka-731');
  });

  it('encodes the original Unicode segment without generating a new slug', () => {
    expect(productPath('ручка-731')).toBe(`/product/${encodeURIComponent('ручка-731')}`);
  });

  it.each([
    '',
    ' ',
    '.',
    '..',
    '../catalog',
    'a/b',
    'a\\b',
    'a?x=1',
    'a#part',
    '%2fadmin',
    ' slug',
    'slug\n',
    null,
    undefined,
  ])('rejects an unsafe segment %s', (value) => {
    expect(isValidProductSlug(value)).toBe(false);
  });

  it('does not silently turn a route or external URL into a product segment', () => {
    expect(() => productPath('https://example.com/product')).toThrow(TypeError);
  });
});
