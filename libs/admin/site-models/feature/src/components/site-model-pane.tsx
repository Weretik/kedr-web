import { StatusPill } from '@admin/shared/ui';
import {
  useGetAttributeOptionsQuery,
  useGetSiteShowcaseQuery,
} from '@admin/site-models/data-access';
import { similarSiteModels, siteModelAllProblems } from '@admin/site-models/model';
import {
  AddModelProductsPanel,
  SiteModelAxesCard,
  SiteModelCharacteristicsCard,
  SiteModelNameForm,
  SiteModelProductsCard,
  SiteModelTextsCard,
  SiteProblemPills,
  SiteSimilarModelsCard,
} from '@admin/site-models/ui';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Alert, Box, Button, Card, Skeleton, Stack, Tab, Tabs, Typography } from '@mui/material';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';

import { ProductAttributesPanel } from './product-attributes-panel';
import { useAxisValueOptions } from '../hooks/use-axis-value-options';
import { useSiteModelEditor } from '../hooks/use-site-model-editor';

import type { EditedSiteProduct } from './product-attributes-panel';

interface SiteModelPaneProps {
  modelId: number;
  onNotice: (text: string) => void;
  /** Opens the next row of the queue. */
  onNext: () => void;
  hasNext: boolean;
}

type PaneTab = 'products' | 'texts';

/**
 * The model card beside the queue: products with their photos and axis values, the switchers, similar proposals to
 * merge, and the SEO texts. A proposal is reviewed with «Погодити і далі»; there is no bulk accept.
 */
export function SiteModelPane({ hasNext, modelId, onNext, onNotice }: SiteModelPaneProps) {
  const editor = useSiteModelEditor(modelId, onNotice);
  const { model } = editor;
  const [tab, setTab] = useState<PaneTab>('products');
  const [renaming, setRenaming] = useState(false);
  const [adding, setAdding] = useState(false);
  const [edited, setEdited] = useState<EditedSiteProduct>();
  const attributeOptions = useGetAttributeOptionsQuery();
  const axisValues = useAxisValueOptions(model?.axes ?? []);
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

  const problems = siteModelAllProblems(model);
  const proposed = model.status === 'proposed';
  const inModel = new Set(model.products.map((product) => product.productId));
  const rows = neighbours.data?.items ?? [];
  const similar = similarSiteModels(rows, model);
  const candidates = rows
    .filter((row) => row.model === null || row.model.status === 'proposed')
    .flatMap((row) => row.products)
    .filter((item) => !inModel.has(item.productId));

  return (
    <Card
      component="article"
      aria-label={model.name}
      sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, minWidth: 0 }}
      variant="outlined"
    >
      <Stack spacing={1.5} sx={{ px: { xs: 2, md: 3 }, pt: 2.5 }}>
        <Typography color="text.secondary" variant="body2">
          {model.categoryName} · /{model.slug}
        </Typography>
        {renaming ? (
          <SiteModelNameForm
            error={editor.errors.header ?? null}
            helperText="Адреса сторінки на сайті не зміниться."
            initialName={model.name}
            onCancel={() => setRenaming(false)}
            onSubmit={(name) =>
              void editor.rename(model.id, name).then((ok) => ok && setRenaming(false))
            }
            saving={editor.renaming}
            submitLabel="Зберегти назву"
          />
        ) : (
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: 'center', flexWrap: 'wrap' }}
            useFlexGap
          >
            <Typography component="h2" sx={{ overflowWrap: 'anywhere' }} variant="h5">
              {model.name}
            </Typography>
            {proposed ? <StatusPill label="Не перевірена" tone="info" /> : null}
            <Button
              onClick={() => {
                editor.clearError('header');
                setRenaming(true);
              }}
              size="small"
              startIcon={<EditOutlinedIcon />}
            >
              Перейменувати
            </Button>
          </Stack>
        )}
        {problems.length > 0 ? <SiteProblemPills problems={problems} /> : null}
        {editor.errors.header && !renaming ? (
          <Alert severity="error">{editor.errors.header}</Alert>
        ) : null}
        <Tabs
          aria-label="Розділ моделі"
          onChange={(_event, value: PaneTab) => setTab(value)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
          value={tab}
        >
          <Tab label="Товари й ознаки" value="products" />
          <Tab label="SEO та опис" value="texts" />
        </Tabs>
      </Stack>

      <Stack spacing={3} sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: { xs: 2, md: 3 } }}>
        {tab === 'products' ? (
          <>
            <SiteModelProductsCard
              axes={model.axes}
              axisValues={axisValues}
              busy={editor.productsBusy}
              error={editor.errors.products ?? null}
              onAdd={() => {
                editor.clearError('add');
                setAdding(true);
              }}
              onEditAttributes={(product) =>
                setEdited({ productId: product.productId, name: product.name })
              }
              onFillFromNames={() => void editor.fillFromNames(model.id)}
              onRemove={(product) => void editor.removeProduct(model.id, product.productId)}
              onSetValue={(productId, attributeId, valueId) =>
                void editor.setValue(productId, attributeId, valueId)
              }
              products={model.products}
            />
            <SiteSimilarModelsCard
              busy={editor.adding}
              error={editor.errors.add && !adding ? editor.errors.add : null}
              models={similar}
              onMerge={(row) =>
                void editor.addProducts(
                  model.id,
                  row.products.map((product) => product.productId),
                )
              }
            />
            <Box
              sx={{
                alignItems: 'start',
                display: 'grid',
                gap: 3,
                gridTemplateColumns: { xs: 'minmax(0, 1fr)', xl: 'repeat(2, minmax(0, 1fr))' },
              }}
            >
              <SiteModelAxesCard
                axes={model.axes}
                busy={editor.axesBusy}
                error={editor.errors.axes ?? null}
                onChange={(attributeIds) => void editor.setAxes(model.id, attributeIds)}
                options={attributeOptions.data ?? []}
              />
              <SiteModelCharacteristicsCard characteristics={model.characteristics} />
            </Box>
          </>
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

      <Stack
        direction="row"
        spacing={1}
        sx={{
          borderColor: 'divider',
          borderTop: 1,
          justifyContent: 'flex-end',
          px: { xs: 2, md: 3 },
          py: 1.5,
        }}
      >
        {proposed ? (
          <>
            <Button disabled={!hasNext || editor.headerBusy} onClick={onNext}>
              Пропустити
            </Button>
            <Button
              disabled={editor.headerBusy}
              endIcon={<ArrowForwardOutlinedIcon />}
              onClick={() => void editor.accept(model.id).then((ok) => ok && onNext())}
              variant="contained"
            >
              Погодити і далі
            </Button>
          </>
        ) : (
          <Button disabled={!hasNext} endIcon={<ArrowForwardOutlinedIcon />} onClick={onNext}>
            Далі
          </Button>
        )}
      </Stack>

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
