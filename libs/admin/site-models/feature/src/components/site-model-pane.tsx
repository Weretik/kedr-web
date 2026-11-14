import { useGetSiteShowcaseQuery } from '@admin/site-models/data-access';
import { modelAddCandidates, similarSiteModels } from '@admin/site-models/model';
import { AddModelProductsPanel, SiteModelTextsCard } from '@admin/site-models/ui';
import { Alert, Button, Card, Skeleton, Stack } from '@mui/material';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';

import { SiteModelHeader } from './model-pane/site-model-header';
import { SiteModelProductsTab } from './model-pane/site-model-products-tab';
import { SiteModelReviewBar } from './model-pane/site-model-review-bar';
import { ProductAttributesPanel } from './product-attributes-panel';
import { useSiteModelEditor } from '../hooks/use-site-model-editor';

import type { PaneTab } from './model-pane/site-model-header';
import type { EditedSiteProduct } from './product-attributes-panel';

interface SiteModelPaneProps {
  modelId: number;
  onNotice: (text: string) => void;
  /** Opens the next row of the queue. */
  onNext: () => void;
  hasNext: boolean;
}

/**
 * The model card beside the queue: products with their photos and axis values, the switchers, similar proposals to
 * merge, and the SEO texts. A proposal is reviewed with «Погодити і далі»; there is no bulk accept.
 */
export function SiteModelPane({ hasNext, modelId, onNext, onNotice }: SiteModelPaneProps) {
  const editor = useSiteModelEditor(modelId, onNotice);
  const { model } = editor;
  const [tab, setTab] = useState<PaneTab>('products');
  const [adding, setAdding] = useState(false);
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
  const candidates = modelAddCandidates(
    rows,
    model.products.map((product) => product.productId),
  );

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
            adding={adding}
            editor={editor}
            model={model}
            onAdd={() => {
              editor.clearError('add');
              setAdding(true);
            }}
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

      <AddModelProductsPanel
        candidates={candidates}
        categoryName={model.categoryName}
        error={adding ? (editor.errors.add ?? null) : null}
        key={model.id}
        loading={neighbours.isFetching}
        onAdd={(productIds) =>
          void editor.addProducts(model.id, productIds).then((ok) => ok && setAdding(false))
        }
        onClose={() => setAdding(false)}
        open={adding}
        saving={editor.adding}
      />
      <ProductAttributesPanel onClose={() => setEdited(undefined)} product={edited} />
    </Card>
  );
}
