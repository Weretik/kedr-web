import { describe, expect, it } from 'vitest';

import { siteModelAllProblems, siteModelText } from './site-model';
import { isHardSiteProblem, siteProblemLabel } from './site-model-problem';

import type { SiteModel } from './site-model';

const model: SiteModel = {
  id: 1,
  categoryId: 10,
  categoryName: 'Ручки',
  name: 'Ручка Rio',
  slug: 'ruchka-rio',
  status: 'accepted',
  acceptedAt: null,
  acceptedBy: null,
  mainProductId: 7,
  axes: [],
  products: [
    {
      productId: 7,
      name: 'Ручка Rio AB',
      slug: 'ruchka-rio-ab',
      photo: '',
      retailPrice: 100,
      inStock: true,
      exportToSite: true,
      isMain: true,
      values: [],
      problems: ['missing_axis_value', 'same_combination'],
    },
  ],
  texts: [
    {
      language: 'uk',
      shortDescription: 'Коротко',
      description: '',
      seoTitle: 'Ручка',
      seoDescription: '',
    },
  ],
  characteristics: [],
  problems: ['model_no_seo', 'missing_axis_value'],
};

describe('site model', () => {
  it('fills a missing language with empty texts', () => {
    expect(siteModelText(model, 'uk').seoTitle).toBe('Ручка');
    expect(siteModelText(model, 'ru')).toEqual({
      shortDescription: '',
      description: '',
      seoTitle: '',
      seoDescription: '',
    });
  });

  it('lists every problem once', () => {
    expect(siteModelAllProblems(model)).toEqual([
      'model_no_seo',
      'missing_axis_value',
      'same_combination',
    ]);
  });

  it('names problems in Ukrainian and marks «Немає моделі» as the hard one', () => {
    expect(siteProblemLabel('no_model')).toBe('Немає моделі');
    expect(siteProblemLabel('future_code')).toBe('future_code');
    expect(isHardSiteProblem('no_model')).toBe(true);
    expect(isHardSiteProblem('model_no_seo')).toBe(false);
  });
});
