import { AdminEditPanel } from '@admin/shared/ui';
import { Alert, Button } from '@mui/material';
import { useState } from 'react';

import { ProductCandidateList } from './product-candidate-list';
import { ProductCandidateSearch } from './product-candidate-search';

import type { ProductCandidateSearchProps } from './product-candidate-search';
import type { SiteProductCandidate } from '@admin/site-models/model';

interface AddModelProductsPanelProps {
  open: boolean;
  /** Names the model, for example «Модель «Ручка Рим»». */
  subtitle: string;
  /** Free products first; a product of another accepted model is shown locked. */
  candidates: readonly SiteProductCandidate[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  /** The search of the whole catalog; without it the panel lists the given candidates only. */
  search?: ProductCandidateSearchProps;
  onClose: () => void;
  onAdd: (productIds: number[]) => void;
}

/** «Додати в модель» for a model: the right panel to pick products, of any 1C category, outside accepted models. */
export function AddModelProductsPanel(props: AddModelProductsPanelProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const toggle = (candidate: SiteProductCandidate) =>
    setSelected((current) =>
      current.includes(candidate.productId)
        ? current.filter((id) => id !== candidate.productId)
        : [...current, candidate.productId],
    );
  const close = () => {
    setSelected([]);
    props.onClose();
  };

  return (
    <AdminEditPanel
      actions={
        <>
          <Button disabled={props.saving} onClick={close}>
            Скасувати
          </Button>
          <Button
            disabled={props.saving || selected.length === 0}
            onClick={() => props.onAdd(selected)}
            variant="contained"
          >
            Додати{selected.length ? ` (${selected.length})` : ''}
          </Button>
        </>
      }
      busy={props.saving}
      onClose={close}
      open={props.open}
      subtitle={props.subtitle}
      title="Додати товари в модель"
    >
      {props.search ? <ProductCandidateSearch {...props.search} /> : null}
      <ProductCandidateList
        candidates={props.candidates}
        emptyText={
          props.search?.value.trim()
            ? 'Нічого не знайдено.'
            : 'Немає товарів поза прийнятими моделями.'
        }
        loading={props.loading}
        onToggle={toggle}
        selectedIds={selected}
      />
      {props.error ? <Alert severity="error">{props.error}</Alert> : null}
    </AdminEditPanel>
  );
}
