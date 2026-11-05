import type { WholesaleLanguage, WholesalePage, WholesaleText } from '../entities/wholesale-page';

/** Both languages as the form holds them. */
export type WholesaleDraft = Record<WholesaleLanguage, WholesaleText>;

const copyText = (text: WholesaleText): WholesaleText => ({
  ...text,
  steps: text.steps.map((step) => ({ ...step })),
  faq: text.faq.map((item) => ({ ...item })),
});

export function wholesaleToDraft(page: WholesalePage): WholesaleDraft {
  return { uk: copyText(page.texts.uk), ru: copyText(page.texts.ru) };
}

export function isSameWholesaleDraft(a: WholesaleDraft, b: WholesaleDraft): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Moves a question up (-1) or down (+1); out of range leaves the list as it is. */
export function moveFaqItem<T>(items: readonly T[], index: number, offset: -1 | 1): T[] {
  const target = index + offset;
  if (target < 0 || target >= items.length) return [...items];
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
