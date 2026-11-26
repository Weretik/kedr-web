import { AdminEditPanel } from '@admin/shared/ui';
import AddOutlined from '@mui/icons-material/AddOutlined';
import { Alert, Button, Typography } from '@mui/material';

import { SiteModelPicker } from './site-model-picker';

import type { SiteModelListItem } from '@admin/site-models/model';
import type { ComponentProps } from 'react';

interface AddProductToModelPanelProps {
  open: boolean;
  /** Names the product, for example «Ручка Рим хром · Код 1С 11». */
  subtitle: string;
  picker: Omit<ComponentProps<typeof SiteModelPicker>, 'disabled'>;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (model: SiteModelListItem) => void;
  /** «Створити нову модель» with this product instead. */
  onNewModel?: () => void;
}

/** «Додати в модель» for one product: pick the model, of any category, and add the product to it. */
export function AddProductToModelPanel(props: AddProductToModelPanelProps) {
  const model = props.picker.value;
  return (
    <AdminEditPanel
      actions={
        <>
          <Button disabled={props.saving} onClick={props.onClose}>
            Скасувати
          </Button>
          <Button disabled={props.saving || !model} type="submit" variant="contained">
            Додати
          </Button>
        </>
      }
      busy={props.saving}
      onClose={props.onClose}
      onSubmit={(event) => {
        event.preventDefault();
        if (model) props.onSubmit(model);
      }}
      open={props.open}
      subtitle={props.subtitle}
      title="Додати в модель"
    >
      <SiteModelPicker {...props.picker} disabled={props.saving} />
      <Typography color="text.secondary" variant="body2">
        Товар іншої категорії 1С теж можна додати: на сайті він показується в категорії моделі.
      </Typography>
      {props.error ? <Alert severity="error">{props.error}</Alert> : null}
      {props.onNewModel ? (
        <Button
          disabled={props.saving}
          onClick={props.onNewModel}
          startIcon={<AddOutlined />}
          sx={{ justifySelf: 'start' }}
        >
          Створити нову модель
        </Button>
      ) : null}
    </AdminEditPanel>
  );
}
