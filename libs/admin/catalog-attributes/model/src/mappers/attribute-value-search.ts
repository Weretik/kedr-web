import type { CatalogAttributeValue } from '../entities/catalog-attribute';

/** Values whose name or code contains the search; all values for an empty search. */
export function searchAttributeValues(
  values: readonly CatalogAttributeValue[],
  search: string,
): readonly CatalogAttributeValue[] {
  const term = search.trim().toLocaleLowerCase('uk');
  if (!term) return values;
  return values.filter(
    (value) =>
      value.nameUk.toLocaleLowerCase('uk').includes(term) ||
      value.code.toLocaleLowerCase('uk').includes(term),
  );
}
