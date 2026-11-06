import { z } from 'zod';

/** Runtime shapes of the product attribute panel. */
const problemSchema = z.object({ code: z.string(), text: z.string().nullish() });

export const productAttributesSchema = z.object({
  productId: z.number().int().min(1),
  originalName: z.string(),
  baseName: z.string().nullish(),
  review: z.object({
    state: z.enum(['clear', 'needs_review', 'accepted']),
    reasons: z.array(problemSchema),
    acceptedBy: z.string().nullish(),
    acceptedAt: z.string().nullish(),
  }),
  attributes: z.array(
    z.object({
      attributeId: z.number().int().min(1),
      code: z.string(),
      name: z.string(),
      kind: z.enum(['enum', 'number', 'size']),
      unit: z.string().nullish(),
      isVariantAxis: z.boolean(),
      values: z.array(
        z.object({
          position: z.number().int().min(0),
          valueId: z.number().int().nullish(),
          valueName: z.string().nullish(),
          number: z.number().nullish(),
          source: z.enum(['import', 'parser', 'manual']),
          isLocked: z.boolean(),
          isConfirmed: z.boolean(),
          hasAutomatic: z.boolean(),
        }),
      ),
    }),
  ),
});

export const attributeOptionsSchema = z.array(
  z.object({
    id: z.number().int().min(1),
    nameUk: z.string(),
    kind: z.enum(['enum', 'number', 'size']),
    unit: z.string().nullish(),
  }),
);

export const attributeValuesSchema = z.object({
  values: z.array(z.object({ id: z.number().int().min(1), nameUk: z.string() })),
});

export const createdAttributeSchema = z.object({
  attribute: z.object({ id: z.number().int().min(1) }),
});
