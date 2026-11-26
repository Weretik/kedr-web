import { AdminDetailHeader, NoticeSnackbar, PageLoader } from '@admin/shared/ui';
import { siteModelsBackPath } from '@admin/site-models/model';
import { SiteModelMainCard } from '@admin/site-models/ui';
import { Alert, Button, Stack } from '@mui/material';
import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { SiteModelPageActions } from '../components/model-page/site-model-page-actions';
import { SiteModelSections } from '../components/model-page/site-model-sections';
import { useSiteModelPanels } from '../components/panels/site-model-panels-context';
import { ProductAttributesPanel } from '../components/product-pane/product-attributes-panel';
import { useSiteModelEditor } from '../hooks/model-editor/use-site-model-editor';
import { siteModelArrivalNotice, siteModelListSearch } from '../model/site-model-page-state';

import type { EditedSiteProduct } from '../components/product-pane/product-attributes-panel';

/** A model of the site, read-only; every change opens the shared panel (spec 001 R-003). */
export function SiteModelPage() {
  const { id: idParam } = useParams<{ id: string }>();
  const id = Number(idParam);
  const location = useLocation();
  const panels = useSiteModelPanels();
  const [notice, setNotice] = useState(() => siteModelArrivalNotice(location.state));
  const [edited, setEdited] = useState<EditedSiteProduct>();
  const editor = useSiteModelEditor(Number.isInteger(id) && id > 0 ? id : undefined, setNotice);
  const model = editor.model;
  const backTo = siteModelsBackPath(siteModelListSearch(location.state));

  if (!model)
    return editor.loadError || !(id > 0) ? (
      <Stack spacing={3}>
        <AdminDetailHeader backLabel="До моделей" backTo={backTo} title="Модель" />
        <Alert
          action={<Button onClick={() => void editor.retry()}>Повторити</Button>}
          severity="error"
        >
          Не вдалося завантажити модель.
        </Alert>
      </Stack>
    ) : (
      <PageLoader label="Завантаження моделі" />
    );

  return (
    <Stack component="section" spacing={3}>
      <AdminDetailHeader
        actions={
          <SiteModelPageActions
            busy={editor.headerBusy}
            onAccept={() => void editor.accept(model.id)}
            onEdit={() => panels.openEditModel(model.id)}
            proposed={model.status === 'proposed'}
          />
        }
        backLabel="До моделей"
        backTo={backTo}
        title={model.name}
      />
      {editor.errors.header ? <Alert severity="error">{editor.errors.header}</Alert> : null}
      <SiteModelMainCard model={model} />
      <SiteModelSections
        editor={editor}
        model={model}
        onAdd={() => panels.openAddToModel({ modelId: model.id })}
        onEditAttributes={setEdited}
      />
      <ProductAttributesPanel onClose={() => setEdited(undefined)} product={edited} />
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default SiteModelPage;
