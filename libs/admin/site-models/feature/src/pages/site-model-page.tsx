import { AdminDetailHeader, ChangedNote, NoticeSnackbar, PageLoader } from '@admin/shared/ui';
import {
  useGetAttributeOptionsQuery,
  useGetSiteShowcaseQuery,
} from '@admin/site-models/data-access';
import { siteModelAllProblems } from '@admin/site-models/model';
import {
  AddModelProductsDialog,
  SiteModelAxesCard,
  SiteModelCharacteristicsCard,
  SiteModelNameDialog,
  SiteModelProductsCard,
  SiteModelTextsCard,
  SiteProblemPills,
} from '@admin/site-models/ui';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { ProductAttributesPanel } from '../components/product-attributes-panel';
import { useAxisValueOptions } from '../hooks/use-axis-value-options';
import { useSiteModelEditor } from '../hooks/use-site-model-editor';
import { siteListReturn } from '../model/site-list-return';

import type { EditedSiteProduct } from '../components/product-attributes-panel';

/** The model card: its products and their axis values, the switchers, and the SEO texts. */
export function SiteModelPage() {
  const params = useParams();
  const back = siteListReturn(useLocation().state);
  const id = Number(params['id']) || undefined;
  const [notice, setNotice] = useState<string | null>(null);
  const editor = useSiteModelEditor(id, setNotice);
  const { model } = editor;
  const [renaming, setRenaming] = useState(false);
  const [adding, setAdding] = useState(false);
  const [edited, setEdited] = useState<EditedSiteProduct>();
  const attributeOptions = useGetAttributeOptionsQuery();
  const axisValues = useAxisValueOptions(model?.axes ?? []);
  const candidates = useGetSiteShowcaseQuery(
    adding && model
      ? { categoryId: model.categoryId, problem: 'no_model', page: 1, pageSize: 200 }
      : skipToken,
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
  if (!model) return <PageLoader label="Завантаження моделі" />;

  const problems = siteModelAllProblems(model);
  const inModel = new Set(model.products.map((product) => product.productId));

  return (
    <Stack component="article" spacing={3}>
      <AdminDetailHeader
        actions={
          <>
            <Button
              disabled={editor.headerBusy}
              onClick={() => {
                editor.clearError('header');
                setRenaming(true);
              }}
            >
              Перейменувати
            </Button>
            {model.status === 'proposed' ? (
              <Button
                disabled={editor.headerBusy}
                onClick={() => void editor.accept(model.id)}
                variant="contained"
              >
                Прийняти модель
              </Button>
            ) : null}
          </>
        }
        backLabel={back.label}
        backTo={back.path}
        title={model.name}
      />
      <Stack spacing={0.5}>
        <Typography color="text.secondary" variant="body2">
          {model.categoryName} · /{model.slug}
          {model.status === 'proposed' ? ' · запропонована автоматично' : ''}
        </Typography>
        {model.acceptedAt ? (
          <ChangedNote at={model.acceptedAt} by={model.acceptedBy} label="Прийнято" />
        ) : null}
      </Stack>
      {editor.errors.header && !renaming ? (
        <Alert severity="error">{editor.errors.header}</Alert>
      ) : null}
      {problems.length > 0 ? (
        <Alert severity={problems.includes('no_model') ? 'error' : 'warning'}>
          <Stack spacing={1}>
            <span>Що виправити, щоб сторінка моделі була повною:</span>
            <SiteProblemPills problems={problems} />
          </Stack>
        </Alert>
      ) : null}
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
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) minmax(0, 1.4fr)' },
          alignItems: 'start',
        }}
      >
        <Stack spacing={3}>
          <SiteModelAxesCard
            axes={model.axes}
            busy={editor.axesBusy}
            error={editor.errors.axes ?? null}
            onChange={(attributeIds) => void editor.setAxes(model.id, attributeIds)}
            options={attributeOptions.data ?? []}
          />
          <SiteModelCharacteristicsCard characteristics={model.characteristics} />
        </Stack>
        <SiteModelTextsCard
          error={editor.errors.texts ?? null}
          key={model.id}
          model={model}
          onSave={(language, text) => editor.saveText(model.id, language, text)}
          saving={editor.textSaving}
        />
      </Box>
      {renaming ? (
        <SiteModelNameDialog
          description="Адреса сторінки на сайті не зміниться."
          error={editor.errors.header ?? null}
          initialName={model.name}
          onCancel={() => setRenaming(false)}
          onSubmit={(name) =>
            void editor.rename(model.id, name).then((ok) => ok && setRenaming(false))
          }
          saving={editor.renaming}
          submitLabel="Зберегти"
          title="Перейменувати модель"
        />
      ) : null}
      {adding ? (
        <AddModelProductsDialog
          candidates={(candidates.data?.items ?? [])
            .flatMap((row) => row.products)
            .filter((item) => !inModel.has(item.productId))}
          categoryName={model.categoryName}
          error={editor.errors.add ?? null}
          loading={candidates.isFetching}
          onAdd={(productIds) =>
            void editor.addProducts(model.id, productIds).then((ok) => ok && setAdding(false))
          }
          onCancel={() => setAdding(false)}
          saving={editor.adding}
        />
      ) : null}
      <ProductAttributesPanel onClose={() => setEdited(undefined)} product={edited} />
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default SiteModelPage;
