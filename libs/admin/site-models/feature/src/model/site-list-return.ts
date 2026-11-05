/** Where the model card goes back to: the list it was opened from, with its filters. */
export interface SiteListReturn {
  path: string;
  label: string;
}

/** Navigation state a list passes when it opens a model card. */
export interface SiteListReturnState {
  from: string;
}

const lists = [
  { prefix: '/site-models', label: 'Моделі' },
  { prefix: '/site-showcase', label: 'Вітрина сайту' },
] as const;

/** The list address with its filters from the navigation state; «Моделі» when there is none. */
export function siteListReturn(state: unknown): SiteListReturn {
  const from =
    typeof state === 'object' && state !== null && 'from' in state && typeof state.from === 'string'
      ? state.from
      : undefined;
  const list = from
    ? lists.find(({ prefix }) => from === prefix || from.startsWith(`${prefix}?`))
    : undefined;
  return list && from
    ? { path: from, label: list.label }
    : { path: '/site-models', label: 'Моделі' };
}

/** The state to pass when a list at this address opens a model card. */
export function siteListReturnState(pathname: string, search: string): SiteListReturnState {
  return { from: `${pathname}${search}` };
}
