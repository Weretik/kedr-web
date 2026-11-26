import { useGetSiteShowcaseQuery } from '@admin/site-models/data-access';
import { similarSiteModels } from '@admin/site-models/model';
import { SiteModelTextsCard } from '@admin/site-models/ui';
import { Alert, Button, Card, Skeleton, Stack } from '@mui/material';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';

import { SiteModelHeader } from './site-model-header';
import { SiteModelProductsTab } from './site-model-products-tab';
import { SiteModelReviewBar } from './site-model-review-bar';
import { useSiteModelEditor } from '../../hooks/model-editor/use-site-model-editor';
import { useSiteModelPanels } from '../panels/site-model-panels-context';
import { ProductAttributesPanel } from '../product-pane/product-attributes-panel';

import type { PaneTab } from './site-model-header';
import type { EditedSiteProduct } from '../product-pane/product-attributes-panel';

interface SiteModelPaneProps {
  modelId: number;
  onNotice: (text: string) => void;
  /** Opens the next row of the queue. */
  onNext: () => void;
  hasNext: boolean;
}

/**
 * The model card beside the queue: products with their photos and axis values, the switchers, similar proposals to
 * merge, and the SEO texts. «Додати товар» opens the shared «Додати в модель» panel (spec 001 R-011). A proposal is reviewed with «Погодити і далі»; there is no bulk accept.
 */
export function SiteModelPane({ hasNext, modelId, onNext, onNotice }: SiteModelPaneProps) {
  const editor = useSiteModelEditor(modelId, onNotice);
  const { model } = editor;
  const [tab, setTab] = useState<PaneTab>('products');
  const panels = useSiteModelPanels();
  const [edited, setEdited] = useState<EditedSiteProduct>();
  const neighbours = useGetSiteShowcaseQuery(
    model ? { categoryId: model.categoryId, page: 1, pageSize: 200 } : skipToken,
  );

  if (editor.loadError)
    return (
      <Alert
        action={<Button onClick={() => void editor.retry()}>Повторити</Button>}
        severity="error"
      >
        Не вдалося завантажити модель.
      </Alert>
    );
  if (!model) return <Skeleton aria-label="Завантаження моделі" height={420} variant="rounded" />;

  const rows = neighbours.data?.items ?? [];

  return (
    <Card
      component="article"
      aria-label={model.name}
      sx={{ minWidth: 0, overflow: 'visible' }}
      variant="outlined"
    >
      <SiteModelHeader editor={editor} model={model} onTabChange={setTab} tab={tab} />

      <Stack spacing={3} sx={{ p: { xs: 2, md: 3 } }}>
        {tab === 'products' ? (
          <SiteModelProductsTab
            adding={false}
            editor={editor}
            model={model}
            onAdd={() => panels.openAddToModel({ modelId: model.id })}
            onEditAttributes={setEdited}
            similar={similarSiteModels(rows, model)}
          />
        ) : (
          <SiteModelTextsCard
            error={editor.errors.texts ?? null}
            key={model.id}
            model={model}
            onSave={(language, text) => editor.saveText(model.id, language, text)}
            saving={editor.textSaving}
          />
        )}
      </Stack>

      <SiteModelReviewBar
        busy={editor.headerBusy}
        hasNext={hasNext}
        onAccept={() => void editor.accept(model.id).then((ok) => ok && onNext())}
        onNext={onNext}
        proposed={model.status === 'proposed'}
      />

      <ProductAttributesPanel onClose={() => setEdited(undefined)} product={edited} />
    </Card>
  );
}
