import type { SiteModelStatus } from '../models/site-model';

/** A model a product in no model may join. */
export interface LoneModelCandidate {
  id: number;
  name: string;
  categoryId: number;
  status: SiteModelStatus;
}

function words(name: string): string[] {
  return name.trim().toLocaleLowerCase('uk').split(/\s+/u).filter(Boolean);
}

function sharedLeadingWords(left: readonly string[], right: readonly string[]): number {
  let count = 0;
  while (count < left.length && count < right.length && left[count] === right[count]) count += 1;
  return count;
}

/**
 * The model «Товари без моделі» offers a product first: same category, the most leading words of the name in
 * common (at least the first one), an accepted model before a proposal on a tie.
 */
export function similarModelForProduct<T extends LoneModelCandidate>(
  product: { name: string; categoryId: number },
  models: readonly T[],
): T | undefined {
  const productWords = words(product.name);
  let best: { model: T; score: number } | undefined;
  for (const model of models) {
    if (model.categoryId !== product.categoryId) continue;
    const score = sharedLeadingWords(productWords, words(model.name));
    if (score === 0) continue;
    const better =
      !best ||
      score > best.score ||
      (score === best.score && model.status === 'accepted' && best.model.status !== 'accepted');
    if (better) best = { model, score };
  }
  return best?.model;
}
