/** The tabs of «Ознаки та фільтри» (spec admin/site-models/001, R-009). */
export type SiteAttributesTab = 'attributes' | 'filters';

/** What the app gives the «Ознаки», «Коди з 1С», and «Фільтри категорій» tabs of the attributes feature. */
export interface SiteDictionaryTabProps {
  tab: SiteAttributesTab | 'codes';
  canEdit: boolean;
  /** «Нова ознака» is pressed in the tabs row; the tab opens its panel. */
  creating: boolean;
  onCreatingChange: (creating: boolean) => void;
  onNotice: (text: string) => void;
}

export function readSiteAttributesTab(params: URLSearchParams): SiteAttributesTab {
  return params.get('tab') === 'filters' ? 'filters' : 'attributes';
}
