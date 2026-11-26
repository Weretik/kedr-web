import {
  useAddSiteModelProductsMutation,
  useGetSiteModelsQuery,
} from '@admin/site-models/data-access';
import { AddProductToModelPanel } from '@admin/site-models/ui';
import { useState } from 'react';

import { siteModelsErrorMessage } from '../../errors/site-models-error-message';

import type { SiteModelListItem } from '@admin/site-models/model';

interface SiteProductAddToModelPanelProps {
  productId: number;
  open: boolean;
  onClose: () => void;
  onNotice: (text: string) => void;
  onNewModel: () => void;
}

/** «Додати в модель» for one product: a model picker of the whole catalog (spec 001 R-006). */
export function SiteProductAddToModelPanel(props: SiteProductAddToModelPanelProps) {
  const [search, setSearch] = useState('');
  const [model, setModel] = useState<SiteModelListItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const models = useGetSiteModelsQuery({
    ...(search.trim() && search !== model?.name ? { search: search.trim() } : {}),
    page: 1,
    pageSize: 20,
  });
  const [add, addState] = useAddSiteModelProductsMutation();

  const submit = async (picked: SiteModelListItem) => {
    setError(null);
    try {
      await add({ id: picked.id, productIds: [props.productId] }).unwrap();
      props.onNotice(`Товар додано в модель «${picked.name}»`);
      props.onClose();
    } catch (cause) {
      setError(siteModelsErrorMessage(cause));
    }
  };

  return (
    <AddProductToModelPanel
      error={error}
      onClose={props.onClose}
      onNewModel={props.onNewModel}
      onSubmit={(picked) => void submit(picked)}
      open={props.open}
      picker={{
        models: models.data?.items ?? [],
        loading: models.isFetching,
        search,
        value: model,
        onSearchChange: setSearch,
        onChange: setModel,
      }}
      saving={addState.isLoading}
      subtitle={`Товар · Код 1С ${props.productId}`}
    />
  );
}
