import { useCreateCatalogAttributeMutation } from '@admin/catalog-attributes/data-access';
import {
  NewAttributeFields,
  emptyNewAttribute,
  toNewAttribute,
} from '@admin/catalog-attributes/ui';
import { AdminEditPanel } from '@admin/shared/ui';
import { Alert, Button } from '@mui/material';
import { useState } from 'react';

import { catalogAttributesErrorMessage } from '../../errors/catalog-attributes-error-message';

import type { NewAttributeDraft } from '@admin/catalog-attributes/ui';

interface NewAttributePanelProps {
  open: boolean;
  onClose: () => void;
  /** The attribute was created; the page opens its panel to add values. */
  onCreated: (attributeId: number) => void;
}

/** «Нова ознака» (Admin): an attribute of the owner's own, kept from the dictionary import. */
export function NewAttributePanel({ onClose, onCreated, open }: NewAttributePanelProps) {
  const [create, state] = useCreateCatalogAttributeMutation();
  const [draft, setDraft] = useState<NewAttributeDraft>(emptyNewAttribute);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    setDraft(emptyNewAttribute);
    setTouched(false);
    setError(null);
    onClose();
  };

  const submit = async () => {
    setTouched(true);
    const attribute = toNewAttribute(draft);
    if (!attribute) return;
    setError(null);
    try {
      const created = await create(attribute).unwrap();
      setDraft(emptyNewAttribute);
      setTouched(false);
      onCreated(created.attribute.id);
    } catch (caught) {
      setError(catalogAttributesErrorMessage(caught));
    }
  };

  return (
    <AdminEditPanel
      actions={
        <>
          <Button disabled={state.isLoading} onClick={close}>
            Скасувати
          </Button>
          <Button disabled={state.isLoading} type="submit" variant="contained">
            {state.isLoading ? 'Створення…' : 'Створити'}
          </Button>
        </>
      }
      busy={state.isLoading}
      onClose={close}
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
      open={open}
      title="Нова ознака"
    >
      <NewAttributeFields draft={draft} onChange={setDraft} touched={touched} />
      {error ? <Alert severity="error">{error}</Alert> : null}
    </AdminEditPanel>
  );
}
