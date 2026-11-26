import { createContext, useContext } from 'react';

import type { SiteModelAddTarget } from '@admin/site-models/model';

/** What «Нова модель» opens with: preselected products, a name, a site category. */
export interface NewSiteModelOptions {
  productIds?: readonly number[];
  name?: string;
  categoryId?: number;
}

/** The shared site model panels: one place for every page (spec admin/site-models/001 R-004…R-006, R-011). */
export interface SiteModelPanels {
  openEditModel: (modelId: number) => void;
  openNewModel: (options?: NewSiteModelOptions) => void;
  openAddToModel: (target: SiteModelAddTarget) => void;
}

export const SiteModelPanelsContext = createContext<SiteModelPanels | null>(null);

/** The panels of the nearest `SiteModelPanelsProvider`. */
export function useSiteModelPanels(): SiteModelPanels {
  const panels = useContext(SiteModelPanelsContext);
  if (!panels) throw new Error('useSiteModelPanels needs SiteModelPanelsProvider');
  return panels;
}
