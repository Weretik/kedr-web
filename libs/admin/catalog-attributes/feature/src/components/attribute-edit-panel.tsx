import {
  useCreateAttributeValueMutation,
  useGetCatalogAttributeQuery,
  useUpdateAttributeValueMutation,
  useUpdateCatalogAttributeMutation,
} from '@admin/catalog-attributes/data-access';
import {
  AttributeAliasesCard,
  AttributeSettingsCard,
  AttributeValueForm,
  AttributeValuesCard,
} from '@admin/catalog-attributes/ui';
import { MediaPickerDialog } from '@admin/media/ui';
import { AdminEditPanel, PageLoader } from '@admin/shared/ui';
import { Alert, Button } from '@mui/material';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';

import { catalogAttributesErrorMessage } from '../errors/catalog-attributes-error-message';
import { useTexturePicker } from '../hooks/use-texture-picker';

import type {
  CatalogAttributeChange,
  CatalogAttributeValue,
  CatalogAttributeValueChange,
} from '@admin/catalog-attributes/model';
import type { SwatchTexture } from '@admin/catalog-attributes/ui';

interface AttributeEditPanelProps {
  attributeId: number | undefined;
  open: boolean;
  canEdit: boolean;
  onClose: () => void;
  onNotice: (message: string) => void;
}

/** The value being edited: `null` while adding a new one. */
type ValueEdit = { value: CatalogAttributeValue | null } | undefined;

/** Everything of one attribute: its settings, values with swatches, and 1C spellings. */
export function AttributeEditPanel({
  attributeId,
  canEdit,
  onClose,
  onNotice,
  open,
}: AttributeEditPanelProps) {
  const query = useGetCatalogAttributeQuery(attributeId ?? skipToken);
  const [updateAttribute, attributeState] = useUpdateCatalogAttributeMutation();
  const [createValue, createState] = useCreateAttributeValueMutation();
  const [updateValue, valueState] = useUpdateAttributeValueMutation();
  const [attributeError, setAttributeError] = useState<string | null>(null);
  const [valueEdit, setValueEdit] = useState<ValueEdit>();
  const [valueError, setValueError] = useState<string | null>(null);
  const [texture, setTexture] = useState<SwatchTexture | null>(null);
  const picker = useTexturePicker((file) => setTexture({ id: file.id, url: file.url }));
  const details = query.data;
  const valueSaving = createState.isLoading || valueState.isLoading;

  const saveAttribute = async (change: CatalogAttributeChange) => {
    if (attributeId === undefined) return;
    setAttributeError(null);
    try {
      await updateAttribute({ id: attributeId, change }).unwrap();
      onNotice('Властивість збережено.');
    } catch (error) {
      setAttributeError(catalogAttributesErrorMessage(error));
    }
  };

  const openValue = (value: CatalogAttributeValue | null) => {
    setValueError(null);
    setTexture(
      value?.swatchMediaFileId ? { id: value.swatchMediaFileId, url: value.swatchImageUrl } : null,
    );
    setValueEdit({ value });
  };

  const saveValue = async (change: CatalogAttributeValueChange) => {
    if (attributeId === undefined || !valueEdit) return;
    setValueError(null);
    try {
      if (valueEdit.value)
        await updateValue({ attributeId, valueId: valueEdit.value.id, change }).unwrap();
      else await createValue({ attributeId, change }).unwrap();
      setValueEdit(undefined);
      onNotice('Значення збережено.');
    } catch (error) {
      setValueError(catalogAttributesErrorMessage(error));
    }
  };

  return (
    <AdminEditPanel
      busy={attributeState.isLoading || valueSaving}
      onClose={onClose}
      open={open && attributeId !== undefined}
      subtitle={details?.attribute.nameUk}
      title={canEdit ? 'Редагування ознаки' : 'Ознака'}
    >
      {query.isLoading ? (
        <PageLoader label="Завантаження ознаки" />
      ) : query.isError || !details ? (
        <Alert action={<Button onClick={() => query.refetch()}>Повторити</Button>} severity="error">
          Не вдалося завантажити властивість. Спробуйте ще раз.
        </Alert>
      ) : (
        <>
          <AttributeSettingsCard
            attribute={details.attribute}
            canEdit={canEdit}
            error={attributeError}
            key={details.attribute.id}
            onSave={(change) => void saveAttribute(change)}
            saving={attributeState.isLoading}
          />
          {details.attribute.kind === 'enum' ? (
            <AttributeValuesCard
              canEdit={canEdit}
              editing={valueEdit ? (valueEdit.value?.id ?? 'new') : undefined}
              form={
                valueEdit ? (
                  <AttributeValueForm
                    error={valueError}
                    key={valueEdit.value?.id ?? 'new'}
                    onCancel={() => setValueEdit(undefined)}
                    onPickTexture={picker.onOpen}
                    onSave={(change) => void saveValue(change)}
                    saving={valueSaving}
                    texture={texture}
                    value={valueEdit.value}
                  />
                ) : null
              }
              onAdd={() => openValue(null)}
              onEdit={openValue}
              values={details.values}
            />
          ) : null}
          <AttributeAliasesCard aliases={details.aliases} values={details.values} />
        </>
      )}
      <MediaPickerDialog
        error={picker.error}
        files={picker.files}
        loading={picker.loading}
        multiple={false}
        onCancel={picker.onCancel}
        onConfirm={picker.onConfirm}
        onPageChange={picker.onPageChange}
        onRetry={picker.onRetry}
        onSearchChange={picker.onSearchChange}
        open={picker.open}
        page={picker.page}
        pageCount={picker.pageCount}
        search={picker.search}
        title="Текстура з медіатеки"
      />
    </AdminEditPanel>
  );
}
