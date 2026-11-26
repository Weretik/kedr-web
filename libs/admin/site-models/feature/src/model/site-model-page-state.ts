/**
 * What the model page gets in the history state: the list address to go back to, and a notice to show on arrival.
 * The notice travels with the move because the Admin shell remounts the page subtree on every address change, so a
 * notice kept by the page that created the model is gone by the time the new model opens.
 */
export interface SiteModelPageState {
  listSearch?: string;
  notice?: string;
}

const field = (state: unknown, name: keyof SiteModelPageState): string | undefined =>
  typeof state === 'object' && state !== null && name in state
    ? String((state as Record<string, unknown>)[name])
    : undefined;

export const siteModelListSearch = (state: unknown): string | undefined =>
  field(state, 'listSearch');

export const siteModelArrivalNotice = (state: unknown): string | null =>
  field(state, 'notice') ?? null;
