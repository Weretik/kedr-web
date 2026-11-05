import type { SiteModelStatus } from '../entities/site-model';
import type { SiteProblemFilter } from '../entities/site-model-problem';

export interface SiteShowcaseQuery {
  categoryId?: number;
  problem?: SiteProblemFilter;
  search?: string;
  page: number;
  pageSize: number;
}

export interface SiteModelsQuery {
  categoryId?: number;
  status?: SiteModelStatus;
  problem?: SiteProblemFilter;
  search?: string;
  page: number;
  pageSize: number;
}

export const siteModelsPageSizes = [25, 50, 100] as const;
export const defaultSiteModelsPageSize = 50;
