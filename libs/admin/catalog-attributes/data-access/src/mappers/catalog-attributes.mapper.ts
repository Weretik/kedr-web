import {
  catalogAttributeDetailsSchema,
  catalogAttributeSchema,
  categoryFilterSchema,
  codeDecisionResultSchema,
  codeProductsSchema,
  swatchUploadSchema,
  unresolvedCodeSchema,
} from '../validators/catalog-attributes.schemas';

import type {
  CatalogAttribute,
  CatalogAttributeDetails,
  CatalogAttributeValueChange,
  CategoryFilter,
  CodeDecision,
  CodeDecisionResult,
  CodeProducts,
  NewCatalogAttribute,
  UnresolvedCode,
  UploadedSwatch,
} from '@admin/catalog-attributes/model';
import type { components } from '@shared/api-contracts';
import type { z } from 'zod';

type UpdateValueBody = components['schemas']['UpdateAttributeValueRequest'];
type CreateAttributeBody = components['schemas']['CreateCatalogAttributeRequest'];
type DecideCodeBody = components['schemas']['DecideAttributeCodeRequest'];

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

export function mapCodeProducts(response: unknown): CodeProducts {
  const dto = codeProductsSchema.parse(response);
  return {
    ...dto,
    categories: dto.categories.map((category) => ({
      ...category,
      valueId: category.valueId ?? null,
      valueName: category.valueName ?? null,
    })),
  };
}

/** The decision as the backend takes it; `categories` is sent only when the screen lists them. */
export function toCodeDecisionBody(decision: CodeDecision): DecideCodeBody {
  return {
    valueId: decision.valueId,
    applyToAll: decision.applyToAll ?? true,
    ...(decision.categories
      ? {
          categories: decision.categories.map(({ categoryId, valueId }) => ({
            categoryId,
            valueId,
          })),
        }
      : {}),
  };
}

export function mapCategoryFilters(response: unknown): CategoryFilter[] {
  return categoryFilterSchema.array().parse(response);
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

/** A color or decor picture just put into the media library (CDN `swatches/`). */
export function mapSwatchUpload(response: unknown): UploadedSwatch {
  const { mediaFileId, url } = swatchUploadSchema.parse(response);
  return { id: mediaFileId, url };
}
