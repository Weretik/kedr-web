import type { SiteModelStatus } from './site-model';
import type { SiteProductProblem } from './site-model-problem';

/** A variant value of an on-site product, for example «Колір: Хром». */
export interface SiteShowcaseValue {
  attributeId: number;
  attributeName: string;
  value: string;
}

/** A row of «Вітрина сайту»: an on-site product with its model, variant values, and problems. */
export interface SiteShowcaseItem {
  /** The 1C code. */
  productId: number;
  name: string;
  slug: string;
  photo: string;
  categoryId: number;
  categoryName: string;
  retailPrice: number | null;
  inStock: boolean;
  model: { id: number; name: string; status: SiteModelStatus } | null;
  values: readonly SiteShowcaseValue[];
  problems: readonly SiteProductProblem[];
}

/** A final category of the «Моделі» sidebar. */
export interface SiteModelCategory {
  id: number;
  name: string;
  parentName: string | null;
  onSiteProducts: number;
  acceptedModels: number;
  proposedModels: number;
  /** Accepted models with a problem plus on-site products outside accepted models. */
  problemCount: number;
}

/** Problem counts of «Огляд» and the summary tiles. */
export interface SiteModelHealth {
  productsWithoutModel: number;
  productsWithoutAttributes: number;
  productsMissingAxisValue: number;
  productsWithSameCombination: number;
  modelsWithoutAxes: number;
  modelsWithoutSeo: number;
  modelsWithoutPhoto: number;
  proposedModels: number;
}

/** A page of a list. */
export interface SiteModelsPage<T> {
  items: readonly T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
