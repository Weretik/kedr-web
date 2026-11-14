import type { AttributeValueOption } from '../entities/product-attributes';
import type { SiteModelProductValue } from '../entities/site-model';

/** The loaded values of an axis plus the product's own value, so it stays shown while the list loads. */
export function axisValueOptions(
  loaded: readonly AttributeValueOption[],
  value: Pick<SiteModelProductValue, 'valueId' | 'name'> | undefined,
): readonly AttributeValueOption[] {
  if (!value?.valueId || loaded.some((option) => option.id === value.valueId)) return loaded;
  return [...loaded, { id: value.valueId, name: value.name ?? '' }];
}
