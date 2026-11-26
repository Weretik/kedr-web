import { createContext } from 'react';

import type {
  SiteModelCategory,
  SiteModelStatus,
  SiteProblemFilter,
} from '@admin/site-models/model';

/** Filters of the «Моделі» toolbar besides the search, which the grid's quick filter owns. */
export interface SiteModelsToolbarValue {
  categories: readonly SiteModelCategory[];
  categoriesLoading: boolean;
  categoryId: number | undefined;
  status: SiteModelStatus | undefined;
  problem: SiteProblemFilter | undefined;
  onCategoryChange: (categoryId: number | undefined) => void;
  onStatusChange: (status: SiteModelStatus | undefined) => void;
  onProblemChange: (problem: SiteProblemFilter | undefined) => void;
}

export const SiteModelsToolbarContext = createContext<SiteModelsToolbarValue>({
  categories: [],
  categoriesLoading: false,
  categoryId: undefined,
  status: undefined,
  problem: undefined,
  onCategoryChange: () => undefined,
  onStatusChange: () => undefined,
  onProblemChange: () => undefined,
});
