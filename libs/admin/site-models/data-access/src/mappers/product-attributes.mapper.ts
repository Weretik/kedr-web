import {
  attributeOptionsSchema,
  attributeValuesSchema,
  createdAttributeSchema,
  productAttributesSchema,
} from '../validators/product-attributes.schemas';

import type {
  AttributeOption,
  AttributeValueOption,
  ProductAttributeInput,
  ProductAttributes,
} from '@admin/site-models/model';
import type { components } from '@shared/api-contracts';

type SetProductAttributeBody = components['schemas']['SetProductAttributeRequest'];

export function mapProductAttributes(response: unknown): ProductAttributes {
  const dto = productAttributesSchema.parse(response);
  return {
    productId: dto.productId,
    originalName: dto.originalName,
    baseName: dto.baseName ?? null,
    review: {
      state: dto.review.state,
      reasons: dto.review.reasons.map((reason) => ({
        code: reason.code,
        text: reason.text ?? null,
      })),
      acceptedBy: dto.review.acceptedBy ?? null,
      acceptedAt: dto.review.acceptedAt ?? null,
    },
    attributes: dto.attributes.map((attribute) => ({
      attributeId: attribute.attributeId,
      code: attribute.code,
      name: attribute.name,
      kind: attribute.kind,
      unit: attribute.unit ?? null,
      isVariantAxis: attribute.isVariantAxis,
      values: attribute.values.map((value) => ({
        position: value.position,
        valueId: value.valueId ?? null,
        valueName: value.valueName ?? null,
        number: value.number ?? null,
        source: value.source,
        isLocked: value.isLocked,
        isConfirmed: value.isConfirmed,
        hasAutomatic: value.hasAutomatic,
      })),
    })),
  };
}

export function mapAttributeOptions(response: unknown): AttributeOption[] {
  return attributeOptionsSchema.parse(response).map((attribute) => ({
    id: attribute.id,
    name: attribute.nameUk,
    kind: attribute.kind,
    unit: attribute.unit ?? null,
  }));
}

export function mapAttributeValueOptions(response: unknown): AttributeValueOption[] {
  return attributeValuesSchema
    .parse(response)
    .values.map((value) => ({ id: value.id, name: value.nameUk }));
}

/** The id of an attribute just created. */
export function mapCreatedAttributeId(response: unknown): number {
  return createdAttributeSchema.parse(response).attribute.id;
}

/** The id of the value just created with this name: the newest one when names repeat. */
export function mapCreatedValueId(response: unknown, nameUk: string): number {
  const values = attributeValuesSchema.parse(response).values;
  const created = values.filter((value) => value.nameUk === nameUk.trim());
  const id = Math.max(...created.map((value) => value.id));
  if (!Number.isFinite(id)) throw new Error('The created value is missing from the response.');
  return id;
}

export function toSetProductAttributeBody(input: ProductAttributeInput): SetProductAttributeBody {
  return {
    values:
      'valueIds' in input
        ? input.valueIds.map((valueId) => ({ valueId }))
        : input.numbers.map((number) => ({ number })),
  };
}
