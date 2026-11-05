import {
  catalogAttributeDetailsSchema,
  catalogAttributeSchema,
  categoryFilterSchema,
  codeDecisionResultSchema,
  filterCategoriesSchema,
  unresolvedCodeSchema,
} from '../validators/catalog-attributes.schemas';

import type {
  CatalogAttribute,
  CatalogAttributeDetails,
  CatalogAttributeValueChange,
  CategoryFilter,
  CodeDecisionResult,
  FilterCategoryOption,
  NewCatalogAttribute,
  UnresolvedCode,
} from '@admin/catalog-attributes/model';
import type { components } from '@shared/api-contracts';
import type { z } from 'zod';

type UpdateValueBody = components['schemas']['UpdateAttributeValueRequest'];
type CreateAttributeBody = components['schemas']['CreateCatalogAttributeRequest'];

export function mapCatalogAttributes(response: unknown): CatalogAttribute[] {
  return catalogAttributeSchema.array().parse(response).map(toAttribute);
}

export function mapCatalogAttributeDetails(response: unknown): CatalogAttributeDetails {
  const dto = catalogAttributeDetailsSchema.parse(response);
  return {
    attribute: toAttribute(dto.attribute),
    values: dto.values.map((value) => ({
      ...value,
      nameRu: value.nameRu ?? null,
      swatchHex: value.swatchHex ?? null,
      swatchMediaFileId: value.swatchMediaFileId ?? null,
      swatchImageUrl: value.swatchImageUrl ?? null,
    })),
    aliases: dto.aliases.map((alias) => ({
      id: alias.id,
      scope: alias.scope,
      rawValue: alias.rawValue,
      valueId: alias.valueId ?? null,
      isConfirmed: alias.isConfirmed,
      note: alias.note ?? null,
    })),
  };
}

/** Code and slug are left to the server, which makes them from the name. */
export function toNewAttributeBody(attribute: NewCatalogAttribute): CreateAttributeBody {
  return {
    nameUk: attribute.nameUk.trim(),
    nameRu: attribute.nameRu?.trim() || null,
    kind: attribute.kind,
    unit: attribute.kind === 'number' ? attribute.unit?.trim() || null : null,
    code: null,
    slug: null,
    isFilterable: attribute.isFilterable,
    isVariantAxis: attribute.isVariantAxis,
    sortOrder: attribute.sortOrder,
  };
}

export function toValueBody(change: CatalogAttributeValueChange): UpdateValueBody {
  return {
    nameUk: change.nameUk.trim(),
    nameRu: change.nameRu?.trim() || null,
    sortOrder: change.sortOrder,
    swatchHex: change.swatchHex || null,
    swatchMediaFileId: change.swatchMediaFileId,
  };
}

export function mapUnresolvedCodes(response: unknown): UnresolvedCode[] {
  return unresolvedCodeSchema.array().parse(response).map(toCode);
}

export function mapCodeDecisionResult(response: unknown): CodeDecisionResult {
  const dto = codeDecisionResultSchema.parse(response);
  return { code: toCode(dto.code), valuesConfirmed: dto.valuesConfirmed };
}

export function mapCategoryFilters(response: unknown): CategoryFilter[] {
  return categoryFilterSchema.array().parse(response);
}

/** Leaf categories (where products live) with their full path, ordered by it. */
export function mapFilterCategories(response: unknown): FilterCategoryOption[] {
  const categories = filterCategoriesSchema.parse(response);
  const byId = new Map(categories.map((category) => [category.id, category]));
  const parents = new Set(categories.map((category) => category.parentId));
  const pathOf = (id: number): string => {
    const names: string[] = [];
    const seen = new Set<number>();
    for (let current = byId.get(id); current && !seen.has(current.id);) {
      seen.add(current.id);
      names.unshift(current.shortNameUk.trim() || 'Категорія без назви');
      current = current.parentId === null ? undefined : byId.get(current.parentId);
    }
    return names.join(' / ');
  };
  return categories
    .filter((category) => !parents.has(category.id))
    .map((category) => ({ id: category.id, name: pathOf(category.id) }))
    .sort((left, right) => left.name.localeCompare(right.name, 'uk'));
}

function toAttribute(dto: z.infer<typeof catalogAttributeSchema>): CatalogAttribute {
  return { ...dto, nameRu: dto.nameRu ?? null, unit: dto.unit ?? null };
}

function toCode(dto: z.infer<typeof unresolvedCodeSchema>): UnresolvedCode {
  return {
    ...dto,
    valueId: dto.valueId ?? null,
    valueName: dto.valueName ?? null,
    note: dto.note ?? null,
  };
}
