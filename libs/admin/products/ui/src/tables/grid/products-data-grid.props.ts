import type { ProductBooleanField } from '../cells/products-boolean-filter-header';
import type {
  AdminProductListItem,
  ProductCategoryOption,
  ProductsListSort,
} from '@admin/products/model';
import type { GridFilterModel } from '@mui/x-data-grid';

/** Inputs of the products grid: server paging, sorting and filters. */
export interface ProductsDataGridProps {
  categories?: readonly ProductCategoryOption[];
  categoryId?: number;
  categoriesLoading?: boolean;
  categoriesError?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  booleanFilters: Partial<Record<ProductBooleanField, boolean>>;
  filterModel: GridFilterModel;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onFilterChange: (model: GridFilterModel) => void;
  onBooleanFilterChange: (field: ProductBooleanField, value: boolean | undefined) => void;
  onCategoryChange?: (categoryId: number | undefined) => void;
  onRetry: () => void;
  onSortChange: (sort: ProductsListSort) => void;
  onViewProduct: (product: AdminProductListItem) => void;
  onEditProduct?: (product: AdminProductListItem) => void;
  onAddProduct?: (product: AdminProductListItem) => void;
  page: number;
  pageSize: number;
  rowCount: number;
  rows: readonly AdminProductListItem[];
  sort: ProductsListSort;
  /** «Без фото»: search, category and the stock filter only, without the filter panel. */
  basicFilters?: boolean;
  sortable?: boolean;
  /** «На сайті»: the «Модель» column (model ID as a link) replaces «Категорія». */
  onOpenModel?: (modelId: number) => void;
}
