import { AdminDetailHeader, NoticeSnackbar, PageLoader } from '@admin/shared/ui';
import { siteModelsBackPath } from '@admin/site-models/model';
import {
  SiteModelCharacteristicsCard,
  SiteModelMainCard,
  SiteModelSeoSummaryCard,
} from '@admin/site-models/ui';
import { Alert, Box, Button, Stack } from '@mui/material';
import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { SiteModelPageActions } from '../components/model-page/site-model-page-actions';
import { SiteModelProductsBlock } from '../components/model-page/site-model-products-block';
import { useSiteModelPanels } from '../components/panels/site-model-panels-context';
import { ProductAttributesPanel } from '../components/product-pane/product-attributes-panel';
import { useSiteModelEditor } from '../hooks/model-editor/use-site-model-editor';

import type { EditedSiteProduct } from '../components/product-pane/product-attributes-panel';

const backState = (state: unknown) =>
  typeof state === 'object' && state !== null && 'listSearch' in state
    ? String(state.listSearch)
    : undefined;

/** A model of the site, read-only; every change opens the shared panel (spec 001 R-003). */
export function SiteModelPage() {
  const { id: idParam } = useParams<{ id: string }>();
  const id = Number(idParam);
  const location = useLocation();
  const panels = useSiteModelPanels();
  const [notice, setNotice] = useState<string | null>(null);
  const [edited, setEdited] = useState<EditedSiteProduct>();
  const editor = useSiteModelEditor(Number.isInteger(id) && id > 0 ? id : undefined, setNotice);
  const model = editor.model;
  const backTo = siteModelsBackPath(backState(location.state));

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
      <SiteModelProductsBlock
        editor={editor}
        model={model}
        onAdd={() => panels.openAddToModel({ modelId: model.id })}
        onEditAttributes={setEdited}
      />
      <Box
        sx={{
          alignItems: 'start',
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        <SiteModelCharacteristicsCard characteristics={model.characteristics} />
        <SiteModelSeoSummaryCard model={model} />
      </Box>
      <ProductAttributesPanel onClose={() => setEdited(undefined)} product={edited} />
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default SiteModelPage;
