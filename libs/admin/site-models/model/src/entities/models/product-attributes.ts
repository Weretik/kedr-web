import type { AttributeProblem } from './attribute-problem';

export type AttributeKind = 'enum' | 'number' | 'size';
export type AttributeValueSource = 'import' | 'parser' | 'manual';
export type ProductReviewState = 'clear' | 'needs_review' | 'accepted';

/** One value of a product attribute in position order (the second color of a two-tone handle is position 1). */
export interface ProductAttributeValue {
  position: number;
  valueId: number | null;
  valueName: string | null;
  number: number | null;
  source: AttributeValueSource;
  /** Set by a person: automation never changes it. */
  isLocked: boolean;
  /** False while the decoding behind it is not confirmed; such values stay off site filters. */
  isConfirmed: boolean;
  /** «Повернути автоматичне» brings an automatic value back. */
  hasAutomatic: boolean;
}

export interface ProductAttribute {
  attributeId: number;
  code: string;
  name: string;
  kind: AttributeKind;
  unit: string | null;
  isVariantAxis: boolean;
  values: readonly ProductAttributeValue[];
}

export interface ProductReview {
  state: ProductReviewState;
  reasons: readonly AttributeProblem[];
  acceptedBy: string | null;
  acceptedAt: string | null;
}

/** The «Властивості» panel of a product. The original 1C name is never changed. */
export interface ProductAttributes {
  productId: number;
  originalName: string;
  baseName: string | null;
  review: ProductReview;
  attributes: readonly ProductAttribute[];
}

/** An attribute a person may add to a product. */
export interface AttributeOption {
  id: number;
  name: string;
  kind: AttributeKind;
  unit: string | null;
}

/** A list value a person may choose for an attribute. */
export interface AttributeValueOption {
  id: number;
  name: string;
}

/** What a person sets for one attribute: list values, or numbers for a number attribute. */
export type ProductAttributeInput =
  { valueIds: readonly number[] } | { numbers: readonly number[] };

/** Whether any value of the attribute was set by a person. */
export function isManualAttribute(attribute: ProductAttribute): boolean {
  return attribute.values.some((value) => value.source === 'manual' || value.isLocked);
}

/** The values as one line, for example «Хром / Чорний» or «70 мм». */
export function attributeValueText(attribute: ProductAttribute): string {
  return attribute.values
    .map(
      (value) =>
        value.valueName ??
        (value.number === null
          ? '—'
          : `${value.number}${attribute.unit ? ` ${attribute.unit}` : ''}`),
    )
    .join(' / ');
}
