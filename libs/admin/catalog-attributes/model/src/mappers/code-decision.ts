import type { CodeCategory, CodeChoice, CodeDecision } from '../entities/unresolved-code';

/** The picker choice of a category: its own decoding, or «Як для всіх». */
export function categoryChoice(category: CodeCategory): CodeChoice {
  if (!category.hasOwnValue) return 'inherit';
  return category.valueId === null ? 'none' : `${category.valueId}`;
}

/** The category path without the catalog root («Фурнітура > Ручки > На планці» → «Ручки > На планці»). */
export function shortCategoryPath(path: string): string {
  const parts = path.split(' > ');
  return parts.length > 1 ? parts.slice(1).join(' > ') : path;
}

/**
 * The request for «Зберегти»: the choice for all (empty keeps the code undecided for all) and the choices per
 * category; a category on «Як для всіх» is left out.
 */
export function toCodeDecision(
  all: CodeChoice | '',
  categories: Readonly<Record<number, CodeChoice>>,
): CodeDecision {
  const own = Object.entries(categories)
    .filter(([, choice]) => choice !== 'inherit')
    .map(([categoryId, choice]) => ({
      categoryId: Number(categoryId),
      valueId: choice === 'none' ? null : Number(choice),
    }));
  const applyToAll = all !== '' && all !== 'inherit';
  return {
    valueId: applyToAll && all !== 'none' ? Number(all) : null,
    applyToAll,
    categories: own,
  };
}
