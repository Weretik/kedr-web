import type { CatalogCategory, CatalogTreeNode } from './catalog-model';

export type CategoryFaqItem = { question: string; answer: string };

/** Text the administrator wrote for one language; empty fields are `null`. `bodyHtml` is sanitized by the API. */
export type CategoryContent = {
  seoTitle: string | null;
  metaDescription: string | null;
  h1: string | null;
  bodyHtml: string | null;
  faq: CategoryFaqItem[];
};

/** One category page: the category, its root-to-self breadcrumbs, direct children, price range, and content. */
export type CategoryDetails = CatalogCategory & {
  productCount: number;
  breadcrumbs: CatalogCategory[];
  children: CatalogTreeNode[];
  minPrice: number | null;
  maxPrice: number | null;
  content: CategoryContent | null;
};
