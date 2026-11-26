import { AdminEditPanel, SectionCard } from '@admin/shared/ui';
import {
  SiteModelAxesCard,
  SiteModelCategoryForm,
  SiteModelNameForm,
  SiteModelTextsCard,
} from '@admin/site-models/ui';
import { Alert, Button, Skeleton } from '@mui/material';

import { useSiteModelEditPanel } from '../../hooks/panels/use-site-model-edit-panel';

interface SiteModelEditPanelProps {
  modelId: number;
  open: boolean;
  onClose: () => void;
  onNotice: (text: string) => void;
}

/** «Редагування моделі»: name, site category, switchers, SEO; each block saves on its own (spec 001 R-004). */
export function SiteModelEditPanel({ modelId, onClose, onNotice, open }: SiteModelEditPanelProps) {
  const panel = useSiteModelEditPanel(modelId, onNotice);
  const { editor } = panel;
  const model = editor.model;

  return (
    <AdminEditPanel
      busy={panel.busy}
      onClose={onClose}
      open={open}
      subtitle={model?.name}
      title="Редагування моделі"
    >
      {editor.loadError ? (
        <Alert
          action={<Button onClick={() => void editor.retry()}>Повторити</Button>}
          severity="error"
        >
          Не вдалося завантажити модель.
        </Alert>
      ) : !model ? (
        <Skeleton aria-label="Завантаження моделі" height={320} variant="rounded" />
      ) : (
        <>
          <SectionCard title="Назва">
            <SiteModelNameForm
              error={editor.errors.header ?? null}
              helperText="Адреса сторінки на сайті не зміниться."
              initialName={model.name}
              key={model.name}
              onSubmit={(name) => void editor.rename(model.id, name)}
              saving={editor.renaming}
              submitLabel="Зберегти назву"
            />
          </SectionCard>
          <SectionCard title="Категорія на сайті">
            <SiteModelCategoryForm
              categories={panel.categories}
              error={panel.categoryError}
              initialCategoryId={model.categoryId}
              key={model.categoryId}
              loading={panel.categoriesLoading}
              onSubmit={panel.saveCategory}
              proposed={model.status === 'proposed'}
              saving={panel.categorySaving}
            />
          </SectionCard>
          <SiteModelAxesCard
            axes={model.axes}
            busy={editor.axesBusy}
            error={editor.errors.axes ?? null}
            onChange={(attributeIds) => void editor.setAxes(model.id, attributeIds)}
            onCreateAttribute={editor.createAttribute}
            options={panel.attributeOptions}
            title="Перемикачі"
          />
          <SiteModelTextsCard
            error={editor.errors.texts ?? null}
            model={model}
            onSave={(language, text) => editor.saveText(model.id, language, text)}
            saving={editor.textSaving}
          />
        </>
      )}
    </AdminEditPanel>
  );
}
