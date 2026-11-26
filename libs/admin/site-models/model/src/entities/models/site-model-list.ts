import type { SiteModelStatus } from './site-model';
import type { SiteModelProblem, SiteProblemFilter } from './site-model-problem';

/** A row of «Моделі»: one site model with its site category and what it still lacks. */
export interface SiteModelListItem {
  id: number;
  /** The site category; every product of the model is shown in it. */
  categoryId: number;
  categoryName: string;
  name: string;
  slug: string;
  status: SiteModelStatus;
  productCount: number;
  onSiteCount: number;
  minPrice: number | null;
  photo: string;
  /** Names of the switchers (saved, or offered to a proposal). */
  axes: readonly string[];
  problems: readonly SiteModelProblem[];
  /** 1C categories of its products that differ from the site category; not shown in the admin. */
  oneCCategories: readonly string[];
}

export interface SiteModelListQuery {
  categoryId?: number;
  status?: SiteModelStatus;
  problem?: SiteProblemFilter;
  search?: string;
  page: number;
  pageSize: number;
}
