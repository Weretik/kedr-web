import {
  CatalogActiveFilters,
  CatalogCategorySheet,
  CatalogFiltersModal,
  CatalogQueryActionRow,
  CatalogSearchSheet,
  CatalogSortMenu,
} from '@mobile/catalog/ui';

import type { useCatalogController } from '../hooks/use-catalog-controller';
import type { CatalogCategoryOption } from '@mobile/catalog/model';

type CatalogController = ReturnType<typeof useCatalogController>;
type CategoryPathItem = { id: number; label: string };
type SelectedCategory = { label: string; path: readonly CategoryPathItem[] };

export function CatalogQueryControls({
  applySearch,
  categoriesQueryResult,
  clearSearch,
  clearSearchHistory,
  dispatch,
  removeSearchHistoryEntry,
  retryCategories,
  searchHistory,
  selectSearchHistory,
  state,
}: Pick<
  CatalogController,
  | 'applySearch'
  | 'categoriesQueryResult'
  | 'clearSearch'
  | 'clearSearchHistory'
  | 'dispatch'
  | 'removeSearchHistoryEntry'
  | 'retryCategories'
  | 'searchHistory'
  | 'selectSearchHistory'
  | 'state'
>) {
  const {
    currentData: categories = [],
    isError: isCategoriesError,
    isLoading: isCategoriesLoading,
  } = categoriesQueryResult;

  return (
    <>
      <CatalogQueryActionRow
        onOpenCategories={() => dispatch({ type: 'categoryOpened' })}
        onOpenFilters={() => dispatch({ type: 'filtersOpened' })}
        onOpenSort={() => dispatch({ type: 'sortOpened' })}
      />
      <CatalogSearchSheet
        history={searchHistory}
        onApply={applySearch}
        onClearHistory={clearSearchHistory}
        onChange={(value) => dispatch({ type: 'searchChanged', value })}
        onDismiss={() => dispatch({ type: 'searchDismissed' })}
        onRemoveHistory={removeSearchHistoryEntry}
        onSelectHistory={selectSearchHistory}
        value={state.draftSearch}
        visible={state.searchVisible}
      />
      <CatalogActiveFilters
        category={findCategory(categories, state.query.filters.categoryId)}
        filters={state.query.filters}
        onSelectCategory={(categoryId) => dispatch({ categoryId, type: 'categorySelected' })}
        onRemoveFilter={(field) => dispatch({ field, type: 'filterRemoved' })}
        onRemovePriceRange={() => dispatch({ type: 'priceRangeRemoved' })}
        onRemoveSearch={clearSearch}
        onResetSort={() => dispatch({ type: 'sortReset' })}
        search={state.query.search}
        sort={state.query.sort}
      />
      <CatalogCategorySheet
        categories={categories}
        isError={isCategoriesError}
        isLoading={isCategoriesLoading}
        onApply={() => dispatch({ type: 'categoryApplied' })}
        onChange={(categoryId) => dispatch({ categoryId, type: 'categoryChanged' })}
        onDismiss={() => dispatch({ type: 'categoryDismissed' })}
        onRetry={retryCategories}
        selectedCategoryId={state.draftCategoryId}
        visible={state.categoryVisible}
      />
      <CatalogFiltersModal
        filters={state.draftFilters}
        onApply={() => dispatch({ type: 'filtersApplied' })}
        onChange={(filters) => dispatch({ filters, type: 'filtersChanged' })}
        onDismiss={() => dispatch({ type: 'filtersDismissed' })}
        onReset={() => dispatch({ type: 'queryReset' })}
        visible={state.filtersVisible}
      />
      <CatalogSortMenu
        onDismiss={() => dispatch({ type: 'sortDismissed' })}
        onSelect={(sort) => dispatch({ sort, type: 'sortChanged' })}
        sort={state.query.sort}
        visible={state.sortVisible}
      />
    </>
  );
}

function findCategory(
  categories: readonly CatalogCategoryOption[],
  categoryId: number | undefined,
  path: readonly CategoryPathItem[] = [],
): SelectedCategory | undefined {
  if (categoryId === undefined) return undefined;

  for (const category of categories) {
    const categoryPath = [...path, { id: category.id, label: category.label }];
    if (category.id === categoryId) return { label: category.label, path: categoryPath };
    const child = findCategory(category.children, categoryId, categoryPath);
    if (child !== undefined) return child;
  }

  return undefined;
}
