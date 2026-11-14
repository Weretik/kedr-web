import { isSwatchHex } from '../entities/catalog-attribute';

import type {
  CatalogAttribute,
  CatalogAttributeChange,
  CatalogAttributeValue,
  CatalogAttributeValueChange,
  UploadedSwatch,
} from '../entities/catalog-attribute';

/** How a value is shown in the site filter: only text, a color, or a decor picture. */
export type SwatchKind = 'none' | 'color' | 'texture';

export interface AttributeSettingsValues {
  nameUk: string;
  nameRu: string;
  isFilterable: boolean;
  sortOrder: string;
}

export interface AttributeValueFormValues {
  nameUk: string;
  nameRu: string;
  sortOrder: string;
  kind: SwatchKind;
  hex: string;
}

const nameMaxLength = 128;

const isValidName = (name: string) => name.trim() !== '' && name.trim().length <= nameMaxLength;

const isValidOrder = (sortOrder: string) => {
  const order = Number(sortOrder);
  return sortOrder.trim() !== '' && Number.isInteger(order) && order >= 0;
};

export function attributeSettingsValues(attribute: CatalogAttribute): AttributeSettingsValues {
  return {
    nameUk: attribute.nameUk,
    nameRu: attribute.nameRu ?? '',
    isFilterable: attribute.isFilterable,
    sortOrder: String(attribute.sortOrder),
  };
}

export function checkAttributeSettings(values: AttributeSettingsValues) {
  const nameValid = isValidName(values.nameUk);
  const orderValid = isValidOrder(values.sortOrder);
  return { nameValid, orderValid, valid: nameValid && orderValid };
}

export function attributeSettingsChange(values: AttributeSettingsValues): CatalogAttributeChange {
  return {
    nameUk: values.nameUk,
    nameRu: values.nameRu || null,
    isFilterable: values.isFilterable,
    sortOrder: Number(values.sortOrder),
  };
}

function swatchKindOf(value: CatalogAttributeValue | null): SwatchKind {
  if (value?.swatchMediaFileId) return 'texture';
  if (value?.swatchHex) return 'color';
  return 'none';
}

export function attributeValueFormValues(
  value: CatalogAttributeValue | null,
): AttributeValueFormValues {
  return {
    nameUk: value?.nameUk ?? '',
    nameRu: value?.nameRu ?? '',
    sortOrder: String(value?.sortOrder ?? 0),
    kind: swatchKindOf(value),
    hex: value?.swatchHex ?? '',
  };
}

export function checkAttributeValue(
  values: AttributeValueFormValues,
  texture: UploadedSwatch | null,
) {
  const nameValid = isValidName(values.nameUk);
  const orderValid = isValidOrder(values.sortOrder);
  const hexValid = values.kind !== 'color' || (values.hex !== '' && isSwatchHex(values.hex));
  const textureValid = values.kind !== 'texture' || texture !== null;
  return {
    nameValid,
    orderValid,
    hexValid,
    textureValid,
    valid: nameValid && orderValid && hexValid && textureValid,
  };
}

export function attributeValueChange(
  values: AttributeValueFormValues,
  texture: UploadedSwatch | null,
): CatalogAttributeValueChange {
  return {
    nameUk: values.nameUk,
    nameRu: values.nameRu || null,
    sortOrder: Number(values.sortOrder),
    swatchHex: values.kind === 'color' ? values.hex : null,
    swatchMediaFileId: values.kind === 'texture' ? (texture?.id ?? null) : null,
  };
}
