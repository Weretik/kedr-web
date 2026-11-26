import { missingContentLanguages } from '../../entities/admin-category';

import type { AdminCategory } from '../../entities/admin-category';

/** Where on the category page a problem is fixed: a tab of spec 003 R-008. */
export type CategoryProblemTab = 'seo' | 'models';

export interface CategoryProblem {
  key: 'text' | 'textUk' | 'textRu' | 'noModels' | 'proposedModels';
  label: string;
  tab: CategoryProblemTab;
}

/**
 * What a category lacks (spec 003 R-004): site texts per language, and for a final category models and unaccepted
 * models. Only problems; an empty list means nothing to do.
 */
export function categoryProblems(category: AdminCategory, isFinal: boolean): CategoryProblem[] {
  const problems: CategoryProblem[] = [];
  const missing = missingContentLanguages(category) ?? [];
  if (missing.length === 2) problems.push({ key: 'text', label: 'Немає тексту', tab: 'seo' });
  else if (missing.includes('uk'))
    problems.push({ key: 'textUk', label: 'Немає тексту UK', tab: 'seo' });
  else if (missing.includes('ru'))
    problems.push({ key: 'textRu', label: 'Немає тексту RU', tab: 'seo' });

  if (!isFinal) return problems;
  if (category.modelCount === 0)
    problems.push({ key: 'noModels', label: 'Немає моделей', tab: 'models' });
  if ((category.proposedModelCount ?? 0) > 0)
    problems.push({
      key: 'proposedModels',
      label: `Не перевірено моделей: ${category.proposedModelCount}`,
      tab: 'models',
    });
  return problems;
}
