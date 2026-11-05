import {
  attributeOptionsSchema,
  attributeValuesSchema,
  problemReasonsSchema,
  productAttributesSchema,
  productGroupMembershipSchema,
  productGroupOptionsSchema,
  productGroupSchema,
} from '../validators/product-attributes.schemas';

import type {
  AttributeOption,
  AttributeValueOption,
  ProductAttributeInput,
  ProductAttributes,
  ProductGroup,
  ProductGroupChange,
  ProductGroupMembership,
  ProductGroupOption,
} from '@admin/products/model';
import type { components } from '@shared/api-contracts';
import type { z } from 'zod';

type SetProductAttributeBody = components['schemas']['SetProductAttributeRequest'];
type SetProductGroupBody = components['schemas']['SetProductGroupRequest'];

export interface ProblemReasonCount {
  code: string;
  productCount: number;
}

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

export function toSetProductAttributeBody(input: ProductAttributeInput): SetProductAttributeBody {
  return {
    values:
      'valueIds' in input
        ? input.valueIds.map((valueId) => ({ valueId }))
        : input.numbers.map((number) => ({ number })),
  };
}

export function mapProductGroup(response: unknown): ProductGroup {
  return toGroup(productGroupSchema.parse(response));
}

export function mapProductGroupMembership(response: unknown): ProductGroupMembership {
  const dto = productGroupMembershipSchema.parse(response);
  return {
    productId: dto.productId,
    isPinned: dto.isPinned,
    group: dto.group ? toGroup(dto.group) : null,
  };
}

export function mapProductGroupOptions(response: unknown): ProductGroupOption[] {
  return productGroupOptionsSchema.parse(response);
}

export function toSetProductGroupBody(change: ProductGroupChange): SetProductGroupBody {
  if ('automatic' in change) return { automatic: true };
  if ('noGroup' in change) return { groupId: null, automatic: false };
  return { groupId: change.groupId, automatic: false };
}

export function mapProblemReasons(response: unknown): ProblemReasonCount[] {
  return problemReasonsSchema.parse(response);
}

function toGroup(dto: z.infer<typeof productGroupSchema>): ProductGroup {
  return {
    id: dto.id,
    categoryId: dto.categoryId,
    name: dto.name,
    slug: dto.slug,
    mainProductId: dto.mainProductId ?? null,
    isCreatedManually: dto.isCreatedManually,
    members: dto.members.map((member) => ({
      productId: member.productId,
      name: member.name,
      exportToSite: member.exportToSite,
      isDeleted: member.isDeleted,
      photo: member.photo,
      isPinned: member.isPinned,
      isMain: member.isMain,
      colors: member.colors,
      size: member.size ?? null,
      side: member.side ?? null,
      hasSameVariants: member.hasSameVariants,
    })),
  };
}
