import { describe, expect, it } from 'vitest';

import {
  attributeSettingsChange,
  attributeSettingsValues,
  attributeValueChange,
  attributeValueFormValues,
  checkAttributeSettings,
  checkAttributeValue,
} from './attribute-forms';

import type { CatalogAttribute, CatalogAttributeValue } from '../entities/catalog-attribute';

const attribute = {
  nameUk: 'Колір',
  nameRu: null,
  isFilterable: true,
  sortOrder: 2,
} as CatalogAttribute;
const oak = {
  nameUk: 'Дуб',
  nameRu: 'Дуб',
  sortOrder: 1,
  swatchHex: null,
  swatchMediaFileId: 9,
} as CatalogAttributeValue;

describe('attribute settings form', () => {
  it('starts from the attribute and turns valid values into a change', () => {
    const values = attributeSettingsValues(attribute);
    expect(values).toEqual({ nameUk: 'Колір', nameRu: '', isFilterable: true, sortOrder: '2' });
    expect(checkAttributeSettings(values).valid).toBe(true);
    expect(attributeSettingsChange(values)).toEqual({
      nameUk: 'Колір',
      nameRu: null,
      isFilterable: true,
      sortOrder: 2,
    });
  });

  it('rejects an empty name and a negative or fractional order', () => {
    expect(
      checkAttributeSettings({ ...attributeSettingsValues(attribute), nameUk: ' ' }),
    ).toMatchObject({ nameValid: false, valid: false });
    expect(
      checkAttributeSettings({ ...attributeSettingsValues(attribute), sortOrder: '-1' }).orderValid,
    ).toBe(false);
    expect(
      checkAttributeSettings({ ...attributeSettingsValues(attribute), sortOrder: '1.5' })
        .orderValid,
    ).toBe(false);
  });
});

describe('attribute value form', () => {
  it('opens a value with a picture as a texture swatch', () => {
    expect(attributeValueFormValues(oak)).toEqual({
      nameUk: 'Дуб',
      nameRu: 'Дуб',
      sortOrder: '1',
      kind: 'texture',
      hex: '',
    });
    expect(attributeValueFormValues(null).kind).toBe('none');
  });

  it('needs a picture for a texture and a valid hex for a color', () => {
    const values = attributeValueFormValues(oak);
    expect(checkAttributeValue(values, null).valid).toBe(false);
    expect(checkAttributeValue(values, { id: 9, url: 'oak.png' }).valid).toBe(true);
    expect(checkAttributeValue({ ...values, kind: 'color', hex: 'zz' }, null).valid).toBe(false);
  });

  it('sends only the chosen swatch kind', () => {
    const values = { ...attributeValueFormValues(oak), kind: 'color' as const, hex: '#aabbcc' };
    expect(attributeValueChange(values, { id: 9, url: 'oak.png' })).toEqual({
      nameUk: 'Дуб',
      nameRu: 'Дуб',
      sortOrder: 1,
      swatchHex: '#aabbcc',
      swatchMediaFileId: null,
    });
  });
});
