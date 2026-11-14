import type { SiteModelStatus } from '../models/site-model';
import type { SiteModelProblem, SiteProductProblem } from '../models/site-model-problem';

/** A variant value of an on-site product, for example «Колір: Хром». */
export interface SiteShowcaseValue {
  attributeId: number;
  attributeName: string;
  value: string;
}

/** An on-site product inside a «Вітрина сайту» row, with its variant values and problems. */
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

/** A row of «Вітрина сайту»: a model with its on-site products, or one product in no model. */
export interface SiteShowcaseRow {
  /** `m{modelId}` or `p{productId}`. */
  key: string;
  model: { id: number; name: string; status: SiteModelStatus } | null;
  name: string;
  photo: string;
  categoryId: number;
  categoryName: string;
  minPrice: number | null;
  inStock: boolean;
  products: readonly SiteShowcaseItem[];
  problems: readonly SiteModelProblem[];
}

/** A category shown on the site with on-site products; counts include subcategories. */
export interface SiteModelCategory {
  id: number;
  name: string;
  parentId: number | null;
  onSiteProducts: number;
  acceptedModels: number;
  proposedModels: number;
  /** Accepted models with a problem. */
  problemCount: number;
  /** On-site products in no model: the hard error. */
  loneProducts: number;
  /** Attributes the category itself offers as site filters (without subcategories). */
  filterCount: number;
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
