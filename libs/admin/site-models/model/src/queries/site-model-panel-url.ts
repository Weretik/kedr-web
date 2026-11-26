/** Where «Додати в модель» adds: products into a model, or one product into a model to pick. */
export type SiteModelAddTarget = { modelId: number } | { productId: number };

/** The shared right panel of site models open on any page. */
export type SiteModelPanel =
  { kind: 'edit'; modelId: number } | { kind: 'new' } | { kind: 'add'; target: SiteModelAddTarget };

const pattern = /^(?:(edit)-(\d+)|(new)|add-(m|p)(\d+))$/;

/** The open panel from `?panel=edit-5 | new | add-m5 | add-p11`. */
export function readSiteModelPanel(params: URLSearchParams): SiteModelPanel | undefined {
  const match = pattern.exec(params.get('panel') ?? '');
  if (!match) return undefined;
  if (match[1]) return { kind: 'edit', modelId: Number(match[2]) };
  if (match[3]) return { kind: 'new' };
  const id = Number(match[5]);
  return { kind: 'add', target: match[4] === 'm' ? { modelId: id } : { productId: id } };
}

/** One string per panel, for example `edit-5`: the value of `?panel=` and a React key. */
export function siteModelPanelKey(panel: SiteModelPanel): string {
  if (panel.kind === 'edit') return `edit-${panel.modelId}`;
  if (panel.kind === 'new') return 'new';
  return 'modelId' in panel.target
    ? `add-m${panel.target.modelId}`
    : `add-p${panel.target.productId}`;
}

/** The address with the panel open, or without it; other params stay. */
export function writeSiteModelPanel(
  current: URLSearchParams,
  panel: SiteModelPanel | undefined,
): URLSearchParams {
  const params = new URLSearchParams(current);
  if (panel) params.set('panel', siteModelPanelKey(panel));
  else params.delete('panel');
  return params;
}
