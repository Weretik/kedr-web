import { z } from 'zod';

/** Runtime shapes of the «Властивості» API (spec catalog/006). */
const kind = z.enum(['enum', 'number', 'size']);

export const catalogAttributeSchema = z.object({
  id: z.number().int().min(1),
  code: z.string(),
  nameUk: z.string(),
  nameRu: z.string().nullish(),
  kind,
  unit: z.string().nullish(),
  slug: z.string(),
  isFilterable: z.boolean(),
  isVariantAxis: z.boolean(),
  sortOrder: z.number().int(),
  isEditedManually: z.boolean(),
  valueCount: z.number().int().nonnegative(),
  productCount: z.number().int().nonnegative(),
});

export const catalogAttributeDetailsSchema = z.object({
  attribute: catalogAttributeSchema,
  values: z.array(
    z.object({
      id: z.number().int().min(1),
      code: z.string(),
      nameUk: z.string(),
      nameRu: z.string().nullish(),
      slug: z.string(),
      sortOrder: z.number().int(),
      swatchHex: z.string().nullish(),
      swatchMediaFileId: z.number().int().nullish(),
      swatchImageUrl: z.string().nullish(),
      isEditedManually: z.boolean(),
      productCount: z.number().int().nonnegative(),
    }),
  ),
  aliases: z.array(
    z.object({
      id: z.number().int().min(1),
      scope: z.string(),
      rawValue: z.string(),
      valueId: z.number().int().nullish(),
      isConfirmed: z.boolean(),
      note: z.string().nullish(),
    }),
  ),
});

export const unresolvedCodeSchema = z.object({
  aliasId: z.number().int().min(1),
  attributeId: z.number().int().min(1),
  attributeName: z.string(),
  scope: z.string(),
  rawValue: z.string(),
  valueId: z.number().int().nullish(),
  valueName: z.string().nullish(),
  isConfirmed: z.boolean(),
  note: z.string().nullish(),
  productCount: z.number().int().nonnegative(),
});

export const codeDecisionResultSchema = z.object({
  code: unresolvedCodeSchema,
  valuesConfirmed: z.number().int().nonnegative(),
});

export const codeProductsSchema = z.object({
  aliasId: z.number().int().min(1),
  rawValue: z.string(),
  categories: z.array(
    z.object({
      categoryId: z.number().int().min(1),
      categoryPath: z.string(),
      hasOwnValue: z.boolean(),
      valueId: z.number().int().nullish(),
      valueName: z.string().nullish(),
      products: z.array(
        z.object({
          productId: z.number().int().min(1),
          name: z.string(),
          photo: z.string(),
        }),
      ),
    }),
  ),
});

export const categoryFilterSchema = z.object({
  attributeId: z.number().int().min(1),
  code: z.string(),
  name: z.string(),
  isFilterable: z.boolean(),
  sortOrder: z.number().int(),
  isEditedManually: z.boolean(),
  productCount: z.number().int().nonnegative(),
});

export const swatchUploadSchema = z.object({
  mediaFileId: z.number().int().min(1),
  url: z.string(),
});
