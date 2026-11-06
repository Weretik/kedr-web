import {
  useGetCategoryFiltersQuery,
  useSetCategoryFiltersMutation,
} from '@admin/catalog-attributes/data-access';
import {
  countFinalWithoutFilters,
  filterCategoryTree,
  findFilterCategory,
} from '@admin/catalog-attributes/model';
import { CategoryFiltersEditor, FilterCategoriesTree } from '@admin/catalog-attributes/ui';
import { PageLoader, SectionCard } from '@admin/shared/ui';
import { useGetSiteModelCategoriesQuery } from '@admin/site-models/data-access';
import { Alert, Box, Button, Typography } from '@mui/material';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';

import { catalogAttributesErrorMessage } from '../errors/catalog-attributes-error-message';

import type { CategoryFilter } from '@admin/catalog-attributes/model';

interface CategoryFiltersTabProps {
  canEdit: boolean;
  onNotice: (message: string) => void;
}

/**
 * «Фільтри категорій»: which properties a final category shown on the site offers as filters, and in which order.
 * The tree is the one of «Моделі» (spec catalog/007 R-18, R-20).
 */
export function CategoryFiltersTab({ canEdit, onNotice }: CategoryFiltersTabProps) {
  const categories = useGetSiteModelCategoriesQuery();
  const nodes = filterCategoryTree(categories.data ?? []);
  const [selectedId, setSelectedId] = useState<number>();
  const selected = findFilterCategory(nodes, selectedId);
  const filters = useGetCategoryFiltersQuery(selected?.category.id ?? skipToken);
  const [setFilters, setState] = useSetCategoryFiltersMutation();
  const [error, setError] = useState<string | null>(null);
  const withoutFilters = countFinalWithoutFilters(nodes);

  const save = async (next: CategoryFilter[]) => {
    if (!selected) return;
    setError(null);
    try {
      await setFilters({ categoryId: selected.category.id, filters: next }).unwrap();
      onNotice('Фільтри категорії збережено.');
    } catch (failure) {
      setError(catalogAttributesErrorMessage(failure));
    }
  };

  if (categories.isError)
    return (
      <Alert
        action={<Button onClick={() => void categories.refetch()}>Повторити</Button>}
        severity="error"
      >
        Не вдалося завантажити категорії.
      </Alert>
    );

  return (
    <Box
      sx={{
        alignItems: 'start',
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '320px minmax(0, 760px)' },
      }}
    >
      <FilterCategoriesTree
        loading={categories.isLoading}
        nodes={nodes}
        onSelect={(node) => {
          setError(null);
          setSelectedId(node.category.id);
        }}
        selectedId={selectedId}
      />
      {selected ? (
        <SectionCard title={selected.path}>
          <Typography color="text.secondary" variant="body2">
            Так фільтри стоятимуть на сторінці категорії, згори вниз.
          </Typography>
          {filters.isLoading ? (
            <PageLoader label="Завантаження фільтрів" />
          ) : filters.isError || !filters.data ? (
            <Alert
              action={<Button onClick={() => filters.refetch()}>Повторити</Button>}
              severity="error"
            >
              Не вдалося завантажити фільтри категорії.
            </Alert>
          ) : (
            <CategoryFiltersEditor
              canEdit={canEdit}
              error={error}
              filters={filters.data}
              key={`${selected.category.id}-${filters.fulfilledTimeStamp ?? 0}`}
              onSave={(next) => void save(next)}
              saving={setState.isLoading}
            />
          )}
        </SectionCard>
      ) : (
        <Typography color="text.secondary" sx={{ p: 2 }} variant="body2">
          Виберіть кінцеву категорію зліва.
          {withoutFilters > 0 ? ` Без фільтрів: ${withoutFilters}.` : ''}
        </Typography>
      )}
    </Box>
  );
}
