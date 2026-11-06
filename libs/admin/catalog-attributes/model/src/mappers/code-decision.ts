import type {
  CategoryMeaningsDraft,
  CodeCategory,
  CodeDecision,
  CodeMeaning,
  CodeMeaningChoice,
  MeaningDraft,
  MeaningsDraft,
  UnresolvedCode,
} from '../entities/unresolved-code';

function toRows(meanings: readonly CodeMeaning[], attributeId: number): MeaningDraft[] {
  return meanings.length > 0
    ? meanings.map(({ attributeId: id, valueId }) => ({ attributeId: id, valueId }))
    : [{ attributeId, valueId: null }];
}

/**
 * The decoding for all products as the screen starts it: the current meanings (an assistant's guess included), or
 * one empty row in the code's own attribute.
 */
export function initialMeanings(code: UnresolvedCode): MeaningsDraft {
  return { nothing: false, rows: toRows(code.meanings, code.attributeId) };
}

/** The decoding of a category as the screen starts it: its own meanings, nothing, or «Як для всіх». */
export function initialCategoryMeanings(
  category: CodeCategory,
  attributeId: number,
): CategoryMeaningsDraft {
  if (!category.hasOwnValue) return { mode: 'inherit', rows: [{ attributeId, valueId: null }] };
  return {
    mode: category.meanings.length > 0 ? 'own' : 'none',
    rows: toRows(category.meanings, attributeId),
  };
}

/** The rows with an attribute and a value, the first one per attribute. */
export function completeMeanings(rows: readonly MeaningDraft[]): CodeMeaningChoice[] {
  const seen = new Set<number>();
  return rows.flatMap(({ attributeId, valueId }) => {
    if (attributeId === null || valueId === null || seen.has(attributeId)) return [];
    seen.add(attributeId);
    return [{ attributeId, valueId }];
  });
}

/** Whether the decoding for all products is decided: «нічого не означає» or a complete row. */
export function isMeaningsDecided(draft: MeaningsDraft): boolean {
  return draft.nothing || completeMeanings(draft.rows).length > 0;
}

/** The category path without the catalog root («Фурнітура > Ручки > На планці» → «Ручки > На планці»). */
export function shortCategoryPath(path: string): string {
  const parts = path.split(' > ');
  return parts.length > 1 ? parts.slice(1).join(' > ') : path;
}

/**
 * The request for «Зберегти» (spec catalog/009): the meanings for all products (undecided keeps the code undecided
 * for all) and the categories with their own decoding; a category on «Як для всіх» is left out, one with its own
 * decoding and no complete row means nothing there.
 */
export function toCodeDecision(
  all: MeaningsDraft,
  categories: Readonly<Record<number, CategoryMeaningsDraft>>,
): CodeDecision {
  const own = Object.entries(categories)
    .filter(([, draft]) => draft.mode !== 'inherit')
    .map(([categoryId, draft]) => ({
      categoryId: Number(categoryId),
      valueId: null,
      meanings: draft.mode === 'none' ? [] : completeMeanings(draft.rows),
    }));
  const applyToAll = isMeaningsDecided(all);
  return {
    valueId: null,
    applyToAll,
    categories: own,
    meanings: all.nothing || !applyToAll ? [] : completeMeanings(all.rows),
  };
}
