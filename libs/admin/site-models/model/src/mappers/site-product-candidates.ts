import type { SiteShowcaseItem, SiteShowcaseRow } from '../entities/showcase/site-showcase';

/** A product that can be added to a model, with its 1C category and why it may be locked. */
export interface SiteProductCandidate {
  productId: number;
  name: string;
  photo: string;
  /** The product's own (1C) category. */
  categoryName: string;
  /** «без моделі» or «зараз у пропозиції «…»». */
  note: string;
  /** «Уже в моделі «…»» for a product of another accepted model: the backend refuses it. */
  disabledReason: string | null;
}

const rank = (item: SiteShowcaseItem) =>
  item.model === null ? 0 : item.model.status === 'proposed' ? 1 : 2;

const note = (item: SiteShowcaseItem) =>
  item.model === null
    ? 'без моделі'
    : item.model.status === 'proposed'
      ? `зараз у пропозиції «${item.model.name}»`
      : `у моделі «${item.model.name}»`;

/**
 * Products of showcase rows to offer for a model: free first, then proposals, then products of other accepted models
 * (shown locked). Products already picked or in the model, and repeats, are left out.
 */
export function siteProductCandidates(
  rows: readonly SiteShowcaseRow[],
  excludedIds: readonly number[],
  targetModelId?: number,
): SiteProductCandidate[] {
  const seen = new Set(excludedIds);
  const items: SiteShowcaseItem[] = [];
  for (const item of rows.flatMap((row) => row.products)) {
    if (seen.has(item.productId)) continue;
    seen.add(item.productId);
    items.push(item);
  }
  return items
    .map((item, index) => ({ item, index }))
    .sort((left, right) => rank(left.item) - rank(right.item) || left.index - right.index)
    .map(({ item }) => ({
      productId: item.productId,
      name: item.name,
      photo: item.photo,
      categoryName: item.categoryName,
      note: note(item),
      disabledReason:
        item.model?.status === 'accepted' && item.model.id !== targetModelId
          ? `Уже в моделі «${item.model.name}»`
          : null,
    }));
}

/** «Вільні (без моделі)» searches products in no model; «Усі товари» the whole catalog. */
export type SiteProductScope = 'free' | 'all';
