export type CatalogAttributeKind = 'enum' | 'number' | 'size';

/** A product property in the «Властивості» list. */
export interface CatalogAttribute {
  id: number;
  code: string;
  nameUk: string;
  nameRu: string | null;
  kind: CatalogAttributeKind;
  unit: string | null;
  slug: string;
  isFilterable: boolean;
  isVariantAxis: boolean;
  sortOrder: number;
  /** A person edited it; the dictionary import leaves it. */
  isEditedManually: boolean;
  valueCount: number;
  productCount: number;
}

/** A value of an attribute. The swatch is a color, a decor texture from «Медіа», or neither (text). */
export interface CatalogAttributeValue {
  id: number;
  code: string;
  nameUk: string;
  nameRu: string | null;
  slug: string;
  sortOrder: number;
  swatchHex: string | null;
  swatchMediaFileId: number | null;
  swatchImageUrl: string | null;
  isEditedManually: boolean;
  productCount: number;
}

/** A color or decor picture of a value in «Медіа» (uploaded to the CDN `swatches/` or picked in the library). */
export interface UploadedSwatch {
  id: number;
  url: string | null;
}

/** How a value is written in 1C names; without a value the code is not decoded. */
export interface CatalogAttributeAlias {
  id: number;
  scope: string;
  rawValue: string;
  valueId: number | null;
  isConfirmed: boolean;
  note: string | null;
}

export interface CatalogAttributeDetails {
  attribute: CatalogAttribute;
  values: readonly CatalogAttributeValue[];
  aliases: readonly CatalogAttributeAlias[];
}

export interface CatalogAttributeChange {
  nameUk: string;
  nameRu: string | null;
  isFilterable: boolean;
  sortOrder: number;
}

/** A new attribute an Admin adds («Нова ознака»): a list of values or a number. */
export interface NewCatalogAttribute {
  nameUk: string;
  nameRu: string | null;
  kind: 'enum' | 'number';
  unit: string | null;
  isFilterable: boolean;
  isVariantAxis: boolean;
  sortOrder: number;
}

export interface CatalogAttributeValueChange {
  nameUk: string;
  nameRu: string | null;
  sortOrder: number;
  swatchHex: string | null;
  swatchMediaFileId: number | null;
}

const kindLabels: Record<CatalogAttributeKind, string> = {
  enum: 'Список',
  number: 'Число',
  size: 'Розмір',
};

export function attributeKindLabel(kind: CatalogAttributeKind): string {
  return kindLabels[kind];
}

/** A #RRGGBB color, or empty. */
export function isSwatchHex(value: string): boolean {
  return value === '' || /^#[0-9A-Fa-f]{6}$/.test(value);
}
