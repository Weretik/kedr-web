import { useAddCategorySiteModelsMutation } from '@admin/categories/data-access';
import { useGetSiteModelsQuery } from '@admin/site-models/data-access';
import { useDeferredValue, useMemo, useState } from 'react';

import { categoryPlacementErrorMessage } from '../../errors/category-placement-error-message';

import type { AdminCategory, CategorySiteModel } from '@admin/categories/model';
import type { SiteModelListItem } from '@admin/site-models/model';

const pageSize = 200;
const messages = {
  conflict: 'Моделі змінили одночасно. Спробуйте ще раз.',
  fallback: 'Не вдалося додати моделі.',
};

const toCategoryModel = (model: SiteModelListItem): CategorySiteModel => ({
  id: model.id,
  name: model.name,
  isProposed: model.status === 'proposed',
  productCount: model.productCount,
  categoryName: model.categoryName,
});

/** «Моделі на сайті» of a final category and the panel that adds models to it (spec 002 R-006). */
export function useCategorySiteModels(
  category: AdminCategory,
  onNotice: (message: string) => void,
) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ReadonlySet<number>>(new Set());
  const [error, setError] = useState<string | undefined>();
  const deferredSearch = useDeferredValue(search.trim());
  const listQuery = useGetSiteModelsQuery({ categoryId: category.id, page: 1, pageSize });
  const searchQuery = useGetSiteModelsQuery(
    { search: deferredSearch || undefined, page: 1, pageSize: 50 },
    { skip: !open },
  );
  const [add, adding] = useAddCategorySiteModelsMutation();

  const models = useMemo(
    () =>
      (listQuery.data?.items ?? [])
        .filter((row) => row.categoryId === category.id)
        .map(toCategoryModel),
    [listQuery.data, category.id],
  );
  const presentIds = useMemo(() => new Set(models.map((model) => model.id)), [models]);

  const submit = async () => {
    if (adding.isLoading || selected.size === 0) return;
    setError(undefined);
    try {
      await add({ id: category.id, modelIds: [...selected] }).unwrap();
      setOpen(false);
      onNotice('Моделі додано.');
    } catch (cause) {
      setError(categoryPlacementErrorMessage(cause, messages));
    }
  };

  return {
    models,
    loading: listQuery.isLoading,
    error: listQuery.isError,
    retry: () => void listQuery.refetch(),
    panel: {
      open,
      search,
      models: (searchQuery.data?.items ?? []).map(toCategoryModel),
      presentIds,
      selectedIds: selected,
      loading: searchQuery.isFetching,
      saving: adding.isLoading,
      error,
    },
    start: () => {
      setSelected(new Set());
      setSearch('');
      setError(undefined);
      setOpen(true);
    },
    close: () => setOpen(false),
    setSearch,
    toggle: (modelId: number) =>
      setSelected((current) => {
        const next = new Set(current);
        if (!next.delete(modelId)) next.add(modelId);
        return next;
      }),
    submit,
  };
}
