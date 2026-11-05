import {
  siteModelCategoriesSchema,
  siteModelHealthSchema,
  siteModelListSchema,
  siteModelSchema,
  siteShowcaseListSchema,
} from '../validators/site-models.schemas';

import type {
  SiteModel,
  SiteModelCategory,
  SiteModelHealth,
  SiteModelListItem,
  SiteModelProblem,
  SiteModelsPage,
  SiteModelsQuery,
  SiteModelTextInput,
  SiteProductProblem,
  SiteShowcaseQuery,
  SiteShowcaseRow,
} from '@admin/site-models/model';
import type { components } from '@shared/api-contracts';

type SetSiteModelTextBody = components['schemas']['SetSiteModelTextRequest'];

// Codes come from the backend; unknown ones are shown as they are.
const asProblems = (codes: readonly string[]) => codes as SiteModelProblem[];

export function mapSiteModelList(response: unknown): SiteModelsPage<SiteModelListItem> {
  const dto = siteModelListSchema.parse(response);
  return {
    ...dto,
    items: dto.items.map((item) => ({
      ...item,
      minPrice: item.minPrice ?? null,
      problems: asProblems(item.problems),
    })),
  };
}

export function mapSiteModel(response: unknown): SiteModel {
  const dto = siteModelSchema.parse(response);
  return {
    ...dto,
    acceptedAt: dto.acceptedAt ?? null,
    acceptedBy: dto.acceptedBy ?? null,
    mainProductId: dto.mainProductId ?? null,
    products: dto.products.map((product) => ({
      ...product,
      retailPrice: product.retailPrice ?? null,
      values: product.values.map((value) => ({
        attributeId: value.attributeId,
        valueId: value.valueId ?? null,
        name: value.name ?? null,
        isManual: value.isManual,
      })),
      problems: asProblems(product.problems),
    })),
    problems: asProblems(dto.problems),
  };
}

export function mapSiteShowcase(response: unknown): SiteModelsPage<SiteShowcaseRow> {
  const dto = siteShowcaseListSchema.parse(response);
  return {
    ...dto,
    items: dto.items.map((row) => ({
      ...row,
      model: row.model ?? null,
      minPrice: row.minPrice ?? null,
      problems: asProblems(row.problems),
      products: row.products.map((item) => ({
        ...item,
        retailPrice: item.retailPrice ?? null,
        model: item.model ?? null,
        problems: item.problems as SiteProductProblem[],
      })),
    })),
  };
}

export function mapSiteModelCategories(response: unknown): SiteModelCategory[] {
  return siteModelCategoriesSchema
    .parse(response)
    .map((category) => ({ ...category, parentId: category.parentId ?? null }));
}

export function mapSiteModelHealth(response: unknown): SiteModelHealth {
  return siteModelHealthSchema.parse(response);
}

/** Query string of the showcase: empty filters are left out. */
export function toSiteShowcaseParams(query: SiteShowcaseQuery) {
  return {
    categoryId: query.categoryId,
    status: query.status,
    problem: query.problem,
    search: query.search?.trim() || undefined,
    page: query.page,
    pageSize: query.pageSize,
  };
}

/** Query string of the models list: empty filters are left out. */
export function toSiteModelsParams(query: SiteModelsQuery) {
  return toSiteShowcaseParams(query);
}

/** Blank texts are sent as they are: the backend stores them empty. */
export function toSetSiteModelTextBody(text: SiteModelTextInput): SetSiteModelTextBody {
  return {
    shortDescription: text.shortDescription.trim(),
    description: text.description.trim(),
    seoTitle: text.seoTitle.trim(),
    seoDescription: text.seoDescription.trim(),
  };
}
