import { useCreateSiteModelMutation } from '@admin/site-models/data-access';
import { formatSitePrice } from '@admin/site-models/model';
import { ProductThumb, SiteModelNameForm, SiteProblemPills } from '@admin/site-models/ui';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import { Button, Card, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { ProductAttributesPanel } from './product-attributes-panel';
import { siteModelsErrorMessage } from '../../errors/site-models-error-message';

import type { SiteShowcaseRow } from '@admin/site-models/model';

interface SiteLoneProductPaneProps {
  row: SiteShowcaseRow;
  onNotice: (text: string) => void;
  /** Opens the new model in the queue. */
  onCreated: (modelId: number) => void;
}

/**
 * A product on the site in no model (the hard error): its photo and values, and «Створити модель» from it. To put it
 * into an existing model, open that model and use «Додати товар».
 */
export function SiteLoneProductPane({ onCreated, onNotice, row }: SiteLoneProductPaneProps) {
  const product = row.products[0];
  const [create, createState] = useCreateSiteModelMutation();
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  if (!product) return null;

  const submit = async (name: string) => {
    setError(null);
    try {
      const model = await create({
        categoryId: product.categoryId,
        name,
        productIds: [product.productId],
      }).unwrap();
      onNotice('Модель створено');
      onCreated(model.id);
    } catch (cause) {
      setError(siteModelsErrorMessage(cause));
    }
  };

  return (
    <Card
      component="article"
      aria-label={product.name}
      sx={{ p: { xs: 2, md: 3 } }}
      variant="outlined"
    >
      <Stack spacing={2.5}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
          <ProductThumb size={96} src={product.photo} />
          <Stack spacing={0.75} sx={{ minWidth: 0 }}>
            <Typography color="text.secondary" variant="body2">
              {product.categoryName} · Код 1С {product.productId}
            </Typography>
            <Typography component="h2" sx={{ overflowWrap: 'anywhere' }} variant="h5">
              {product.name}
            </Typography>
            <Typography variant="body2">{formatSitePrice(product.retailPrice)}</Typography>
            {product.values.length > 0 ? (
              <Typography color="text.secondary" variant="body2">
                {product.values
                  .map((value) => `${value.attributeName}: ${value.value}`)
                  .join(' · ')}
              </Typography>
            ) : null}
            <SiteProblemPills problems={row.problems} />
          </Stack>
        </Stack>
        <Button
          onClick={() => setEditing(true)}
          startIcon={<TuneOutlinedIcon />}
          sx={{ alignSelf: 'flex-start' }}
        >
          Усі ознаки товару
        </Button>
        <Stack spacing={1}>
          <Typography sx={{ fontWeight: 600 }} variant="subtitle2">
            Створити модель з цього товару
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Щоб додати товар в існуючу модель, відкрийте її і натисніть «Додати товар».
          </Typography>
          <SiteModelNameForm
            error={error}
            initialName={product.name}
            key={product.productId}
            onSubmit={(name) => void submit(name)}
            saving={createState.isLoading}
            submitLabel="Створити модель"
          />
        </Stack>
      </Stack>
      <ProductAttributesPanel
        onClose={() => setEditing(false)}
        product={editing ? { productId: product.productId, name: product.name } : undefined}
      />
    </Card>
  );
}
