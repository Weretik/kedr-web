import type {
  SiteModel,
  SiteModelAxis,
  SiteModelProduct,
  SiteModelSelection,
} from '../entities/site-model';

export type ModelSearchParams = Readonly<Record<string, string | string[] | undefined>>;

/** One switch of an axis: the value and the product a click opens. */
export type ModelAxisOption = {
  key: string;
  name: string;
  hex: string | null;
  textureUrl: string | null;
  selected: boolean;
  target: SiteModelProduct;
};

export type ModelAxisOptions = { axis: SiteModelAxis; options: ModelAxisOption[] };

/** Only known axes with a value key of the model are read; anything else in the query is ignored. */
export function parseModelSelection(
  model: SiteModel,
  params: ModelSearchParams,
): SiteModelSelection {
  const selection: Record<string, string> = {};
  for (const axis of model.axes) {
    const raw = params[axis.slug];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (value && axis.values.some((item) => item.key === value)) selection[axis.slug] = value;
  }
  return selection;
}

/** The main product, else the first in stock, else the first (products come in stock first). */
export function defaultModelProduct(model: SiteModel): SiteModelProduct | null {
  return (
    model.products.find((product) => product.slug === model.mainProductSlug) ??
    model.products.find((product) => product.isMain) ??
    model.products[0] ??
    null
  );
}

const matches = (product: SiteModelProduct, selection: SiteModelSelection) =>
  Object.entries(selection).filter(([axis, key]) => product.selection[axis] === key).length;

/**
 * The product of the query: the one with the most requested values. Ties keep the default product, then stock order.
 * A query that matches nothing gives the default.
 */
export function selectModelProduct(
  model: SiteModel,
  requested: SiteModelSelection,
): SiteModelProduct | null {
  const fallback = defaultModelProduct(model);
  if (!fallback || Object.keys(requested).length === 0) return fallback;
  let best = fallback;
  let bestScore = matches(fallback, requested);
  for (const product of model.products) {
    const score = matches(product, requested);
    if (score > bestScore) {
      best = product;
      bestScore = score;
    }
  }
  return best;
}

/** The product with `axis` = `key` that keeps most of the current choice; ties prefer in-stock order. */
function closestWith(
  model: SiteModel,
  current: SiteModelProduct,
  axis: string,
  key: string,
): SiteModelProduct | null {
  let best: SiteModelProduct | null = null;
  let bestScore = -1;
  for (const product of model.products) {
    if (product.selection[axis] !== key) continue;
    const score = matches(product, current.selection);
    if (score > bestScore) {
      best = product;
      bestScore = score;
    }
  }
  return best;
}

/**
 * Switches per axis. The first axis offers all its values; each next axis offers only values some product has
 * together with the choice of the axes before it, so a combination no product has is never shown.
 */
export function modelAxisOptions(model: SiteModel, current: SiteModelProduct): ModelAxisOptions[] {
  return model.axes.map((axis, index) => {
    const before = model.axes.slice(0, index).map((item) => item.slug);
    const pool = model.products.filter((product) =>
      before.every((slug) => product.selection[slug] === current.selection[slug]),
    );
    const options: ModelAxisOption[] = [];
    for (const value of axis.values) {
      if (!pool.some((product) => product.selection[axis.slug] === value.key)) continue;
      const selected = current.selection[axis.slug] === value.key;
      const target = selected ? current : closestWith(model, current, axis.slug, value.key);
      if (target) options.push({ ...value, selected, target });
    }
    return { axis, options };
  });
}

/** Up to `limit` products in stock for an out-of-stock choice, those sharing more axis values first (R-02). */
export function inStockAlternatives(
  model: SiteModel,
  current: SiteModelProduct,
  limit = 3,
): SiteModelProduct[] {
  if (current.inStock) return [];
  return model.products
    .filter((product) => product.inStock && product.slug !== current.slug)
    .map((product) => ({ product, score: matches(product, current.selection) }))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((item) => item.product);
}

/** Axis values of a product in axis order, for labels such as «Хром · 100 мм». */
export function selectionLabel(model: SiteModel, product: SiteModelProduct): string {
  return model.axes
    .map((axis) => axis.values.find((value) => value.key === product.selection[axis.slug])?.name)
    .filter((name): name is string => Boolean(name))
    .join(' · ');
}

/**
 * The query of a choice, axes in `axisOrder` (`?kolir=khrom&rozmir=100`), empty without values. It follows the model
 * page address; the canonical address has none.
 */
export function modelSelectionQuery(
  selection: SiteModelSelection,
  axisOrder: readonly string[] = Object.keys(selection),
): string {
  const query = new URLSearchParams();
  for (const axis of axisOrder) {
    const key = selection[axis];
    if (key) query.set(axis, key);
  }
  const text = query.toString();
  return text ? `?${text}` : '';
}
