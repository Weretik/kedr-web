import { describe, expect, it } from 'vitest';

import {
  inStockAlternatives,
  modelAxisOptions,
  modelSelectionQuery,
  parseModelSelection,
  selectModelProduct,
  selectionLabel,
} from './model-selection';

import type { SiteModel, SiteModelProduct } from '../entities/site-model';

const product = (
  sku: string,
  color: string,
  size: string,
  inStock = true,
  isMain = false,
): SiteModelProduct => ({
  sku,
  name: `Завіса ${color} ${size}`,
  slug: `zavisa-${sku}`,
  photoUrl: null,
  price: 100,
  inStock,
  isMain,
  selection: { kolir: color, rozmir: size },
});

const model: SiteModel = {
  slug: 'zavisa-flush',
  name: 'Завіса FLUSH',
  isAccepted: true,
  categorySlug: 'zavisy',
  texts: { shortDescription: '', description: '', seoTitle: '', seoDescription: '' },
  mainProductSlug: 'zavisa-2',
  axes: [
    {
      code: 'color',
      slug: 'kolir',
      name: 'Колір',
      display: 'swatch',
      values: [
        { key: 'khrom', name: 'Хром', hex: '#c9ced3', textureUrl: null },
        { key: 'zoloto', name: 'Золото', hex: '#d4af37', textureUrl: null },
      ],
    },
    {
      code: 'size',
      slug: 'rozmir',
      name: 'Розмір',
      display: 'button',
      values: [
        { key: '100', name: '100 мм', hex: null, textureUrl: null },
        { key: '120', name: '120 мм', hex: null, textureUrl: null },
      ],
    },
  ],
  products: [
    product('1', 'khrom', '100'),
    product('2', 'khrom', '120', true, true),
    product('3', 'zoloto', '100', false),
  ],
  characteristics: [],
};

describe('model selection', () => {
  it('chooses the main product without a query and ignores unknown values', () => {
    expect(selectModelProduct(model, {})?.sku).toBe('2');
    expect(
      selectModelProduct(model, parseModelSelection(model, { kolir: 'mid', x: '1' }))?.sku,
    ).toBe('2');
  });

  it('chooses the product of the query', () => {
    const requested = parseModelSelection(model, { kolir: 'zoloto', rozmir: ['100'] });
    expect(requested).toEqual({ kolir: 'zoloto', rozmir: '100' });
    expect(selectModelProduct(model, requested)?.sku).toBe('3');
    expect(selectModelProduct(model, { rozmir: '100' })?.sku).toBe('1');
  });

  it('hides values no product has with the choice of the axes before', () => {
    const golden = model.products[2];
    const [colors, sizes] = modelAxisOptions(model, golden);
    expect(
      colors.options.map((option) => [option.key, option.selected, option.target.sku]),
    ).toEqual([
      ['khrom', false, '1'],
      ['zoloto', true, '3'],
    ]);
    expect(sizes.options.map((option) => option.key)).toEqual(['100']);
  });

  it('offers in-stock products for an out-of-stock choice, shared values first', () => {
    expect(inStockAlternatives(model, model.products[2]).map((item) => item.sku)).toEqual([
      '1',
      '2',
    ]);
    expect(inStockAlternatives(model, model.products[0])).toEqual([]);
  });

  it('builds labels and the address of a choice in axis order', () => {
    expect(selectionLabel(model, model.products[0])).toBe('Хром · 100 мм');
    expect(modelSelectionQuery({ rozmir: '100', kolir: 'khrom' }, ['kolir', 'rozmir'])).toBe(
      '?kolir=khrom&rozmir=100',
    );
    expect(modelSelectionQuery({})).toBe('');
  });
});
