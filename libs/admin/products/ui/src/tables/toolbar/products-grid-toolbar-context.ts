import { createContext } from 'react';

import type { ProblemFilterProps } from './problem-filter-controls';
import type { ProductCategoryOption } from '@admin/products/model';

export interface ProductsGridToolbarProps {
  categories: readonly ProductCategoryOption[];
  categoryId?: number;
  categoriesLoading: boolean;
  categoriesError: boolean;
  onCategoryChange: (categoryId: number | undefined) => void;
  setPanelAnchor: (element: HTMLDivElement | null) => void;
  /** Problem filters; shown only where given («На сайті»). */
  problemFilter?: ProblemFilterProps;
}

export const ProductsGridToolbarContext = createContext<ProductsGridToolbarProps>({
  categories: [],
  categoriesLoading: false,
  categoriesError: false,
  onCategoryChange: () => undefined,
  setPanelAnchor: () => undefined,
});
