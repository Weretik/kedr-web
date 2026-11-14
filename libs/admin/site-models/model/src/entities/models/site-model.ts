import type { SiteModelProblem } from './site-model-problem';

export type SiteModelStatus = 'proposed' | 'accepted';
export type SiteModelLanguage = 'uk' | 'ru';
export type SiteModelAxisDisplay = 'swatch' | 'button' | 'checkbox';

/** A switcher of the model page: the attribute that tells its products apart. */
export interface SiteModelAxis {
  attributeId: number;
  code: string;
  name: string;
  display: SiteModelAxisDisplay;
  /** False when automation only offers it to a proposal. */
  isSaved: boolean;
}

export interface SiteModelProductValue {
  attributeId: number;
  valueId: number | null;
  name: string | null;
  isManual: boolean;
}

export interface SiteModelProduct {
  productId: number;
  /** The original 1C name; never changed. */
  name: string;
  slug: string;
  photo: string;
  retailPrice: number | null;
  inStock: boolean;
  exportToSite: boolean;
  isMain: boolean;
  /** One per axis, in axis order. */
  values: readonly SiteModelProductValue[];
  problems: readonly SiteModelProblem[];
}

export interface SiteModelText {
  language: SiteModelLanguage;
  shortDescription: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
}

export type SiteModelTextInput = Omit<SiteModelText, 'language'>;

/** Text limits of the backend contract. */
export const siteModelTextLimits: Record<keyof SiteModelTextInput, number> = {
  shortDescription: 500,
  description: 8000,
  seoTitle: 120,
  seoDescription: 320,
};

/** A value shared by all on-site products of a model, shown as a characteristic. */
export interface SiteModelCharacteristic {
  attributeId: number;
  name: string;
  values: readonly string[];
}

/** The model card. */
export interface SiteModel {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  slug: string;
  status: SiteModelStatus;
  acceptedAt: string | null;
  acceptedBy: string | null;
  mainProductId: number | null;
  axes: readonly SiteModelAxis[];
  products: readonly SiteModelProduct[];
  texts: readonly SiteModelText[];
  characteristics: readonly SiteModelCharacteristic[];
  problems: readonly SiteModelProblem[];
}

/** The texts of one language; empty texts when nothing is saved. */
export function siteModelText(model: SiteModel, language: SiteModelLanguage): SiteModelTextInput {
  const text = model.texts.find((item) => item.language === language);
  return {
    shortDescription: text?.shortDescription ?? '',
    description: text?.description ?? '',
    seoTitle: text?.seoTitle ?? '',
    seoDescription: text?.seoDescription ?? '',
  };
}

/** Every problem of the card: the model's own and those of its products, each once. */
export function siteModelAllProblems(model: SiteModel): SiteModelProblem[] {
  return [
    ...new Set([...model.problems, ...model.products.flatMap((product) => product.problems)]),
  ];
}

const money = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' });

/** A retail price for a table cell; «—» without one. */
export function formatSitePrice(price: number | null): string {
  return price === null ? '—' : money.format(price);
}
