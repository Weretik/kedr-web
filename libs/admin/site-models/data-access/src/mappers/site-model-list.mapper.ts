import { siteModelListSchema } from '../validators/site-models.schemas';

import type {
  SiteModelListItem,
  SiteModelListQuery,
  SiteModelProblem,
  SiteModelsPage,
} from '@admin/site-models/model';

/** «Моделі»: one page of models; unknown problem codes pass and show as they are. */
export function mapSiteModelList(response: unknown): SiteModelsPage<SiteModelListItem> {
  const dto = siteModelListSchema.parse(response);
  return {
    ...dto,
    items: dto.items.map((row) => ({
      ...row,
      minPrice: row.minPrice ?? null,
      problems: row.problems as SiteModelProblem[],
    })),
  };
}

/** Query string of «Моделі»: empty filters are left out. */
export function toSiteModelListParams(query: SiteModelListQuery) {
  return {
    categoryId: query.categoryId,
    status: query.status,
    problem: query.problem,
    search: query.search?.trim() || undefined,
    page: query.page,
    pageSize: query.pageSize,
  };
}
