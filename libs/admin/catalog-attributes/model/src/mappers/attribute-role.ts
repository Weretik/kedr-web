import type { CatalogAttribute } from '../entities/catalog-attribute';

/** What an attribute does on the site, as «Ознаки» groups them. */
export type AttributeRole = 'switch' | 'filter' | 'service' | 'unused';

export const attributeRoles: readonly { role: AttributeRole; title: string; hint: string }[] = [
  { role: 'switch', title: 'Перемикачі моделей', hint: 'ними покупець перемикає товари моделі' },
  { role: 'filter', title: 'Фільтри каталогу', hint: 'показуються у фільтрах категорій' },
  { role: 'service', title: 'Службові', hint: 'на сайті не показуються' },
  { role: 'unused', title: 'Не використовуються', hint: 'немає в жодному товарі' },
];

/** A variant axis switches products; an attribute no product has is unused; the rest filter or serve. */
export function attributeRole(attribute: CatalogAttribute): AttributeRole {
  if (attribute.productCount === 0) return 'unused';
  if (attribute.isVariantAxis) return 'switch';
  return attribute.isFilterable ? 'filter' : 'service';
}

/** Attributes by role in the order of `attributeRoles`, each sorted by «Порядок» and name; empty roles left out. */
export function groupAttributesByRole(
  attributes: readonly CatalogAttribute[],
  search = '',
): { role: AttributeRole; title: string; hint: string; attributes: CatalogAttribute[] }[] {
  const term = search.trim().toLocaleLowerCase('uk');
  const shown = term
    ? attributes.filter(
        (attribute) =>
          attribute.nameUk.toLocaleLowerCase('uk').includes(term) ||
          attribute.code.toLocaleLowerCase('uk').includes(term),
      )
    : attributes;
  return attributeRoles
    .map((group) => ({
      ...group,
      attributes: shown
        .filter((attribute) => attributeRole(attribute) === group.role)
        .sort((a, b) => a.sortOrder - b.sortOrder || a.nameUk.localeCompare(b.nameUk, 'uk')),
    }))
    .filter((group) => group.attributes.length > 0);
}
