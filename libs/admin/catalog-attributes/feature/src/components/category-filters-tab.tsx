import {
  useGetCategoryFiltersQuery,
  useGetFilterCategoriesQuery,
  useSetCategoryFiltersMutation,
} from '@admin/catalog-attributes/data-access';
import { CategoryFiltersEditor } from '@admin/catalog-attributes/ui';
import { PageLoader, SectionCard } from '@admin/shared/ui';
import { Alert, Autocomplete, Button, Stack, TextField } from '@mui/material';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';

import { catalogAttributesErrorMessage } from '../errors/catalog-attributes-error-message';

import type { CategoryFilter, FilterCategoryOption } from '@admin/catalog-attributes/model';

interface CategoryFiltersTabProps {
  canEdit: boolean;
  onNotice: (message: string) => void;
}

/** «Фільтри категорій»: which properties a category offers as filters on the site. */
export function CategoryFiltersTab({ canEdit, onNotice }: CategoryFiltersTabProps) {
  const categories = useGetFilterCategoriesQuery();
  const [category, setCategory] = useState<FilterCategoryOption | null>(null);
  const filters = useGetCategoryFiltersQuery(category?.id ?? skipToken);
  const [setFilters, setState] = useSetCategoryFiltersMutation();
  const [error, setError] = useState<string | null>(null);

  const save = async (next: CategoryFilter[]) => {
    if (!category) return;
    setError(null);
    try {
      await setFilters({ categoryId: category.id, filters: next }).unwrap();
      onNotice('Фільтри категорії збережено.');
    } catch (failure) {
      setError(catalogAttributesErrorMessage(failure));
    }
  };

  return (
    <Stack spacing={2}>
      <Autocomplete
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        loading={categories.isFetching}
        onChange={(_event, option) => {
          setError(null);
          setCategory(option);
        }}
        options={categories.data ?? []}
        renderInput={(params) => (
          <TextField
            {...params}
            error={categories.isError}
            helperText={categories.isError ? 'Не вдалося завантажити категорії.' : undefined}
            label="Категорія"
          />
        )}
        sx={{ maxWidth: 560 }}
        value={category}
      />
      {category ? (
        <SectionCard title={`Фільтри: ${category.name}`}>
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
              key={`${category.id}-${filters.fulfilledTimeStamp ?? 0}`}
              onSave={(next) => void save(next)}
              saving={setState.isLoading}
            />
          )}
        </SectionCard>
      ) : null}
    </Stack>
  );
}
