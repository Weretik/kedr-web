import { useGetCatalogAttributeQuery } from '@admin/catalog-attributes/data-access';
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

import { useAttributeSettingsSave } from '../hooks/use-attribute-settings-save';
import { useAttributeValueEditor } from '../hooks/use-attribute-value-editor';
import { useTexturePicker } from '../hooks/use-texture-picker';

import type { ValueEdit } from '../hooks/use-attribute-value-editor';

interface AttributeEditPanelProps {
  attributeId: number | undefined;
  open: boolean;
  canEdit: boolean;
  onClose: () => void;
  onNotice: (message: string) => void;
  /** Opens the panel right on this value's form (`null`: a new value). */
  initialValueEdit?: ValueEdit;
}

/** Everything of one attribute: its settings, values with swatches, and 1C spellings. */
export function AttributeEditPanel({
  attributeId,
  canEdit,
  initialValueEdit,
  onClose,
  onNotice,
  open,
}: AttributeEditPanelProps) {
  const query = useGetCatalogAttributeQuery(attributeId ?? skipToken);
  const settings = useAttributeSettingsSave(attributeId, onNotice);
  const values = useAttributeValueEditor(attributeId, initialValueEdit, onNotice);
  const picker = useTexturePicker((file) => values.setTexture({ id: file.id, url: file.url }));
  const details = query.data;

  return (
    <AdminEditPanel
      busy={settings.saving || values.saving || values.uploading}
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
            error={settings.error}
            key={details.attribute.id}
            onSave={(change) => void settings.save(change)}
            saving={settings.saving}
          />
          {details.attribute.kind === 'enum' ? (
            <AttributeValuesCard
              canEdit={canEdit}
              editing={values.edit ? (values.edit.value?.id ?? 'new') : undefined}
              form={
                values.edit ? (
                  <AttributeValueForm
                    error={values.error}
                    key={values.edit.value?.id ?? 'new'}
                    onCancel={values.close}
                    onPickTexture={picker.onOpen}
                    onUploadTexture={(file) => void values.upload(file)}
                    onSave={(change) => void values.save(change)}
                    saving={values.saving}
                    texture={values.texture}
                    uploading={values.uploading}
                    value={values.edit.value}
                  />
                ) : null
              }
              onAdd={() => values.open(null)}
              onEdit={values.open}
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
        title="Картинка з медіатеки"
      />
    </AdminEditPanel>
  );
}
