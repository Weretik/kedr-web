import { DetailField, DetailFieldList, SectionCard, StatusPill } from '@admin/shared/ui';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';

import type { ProductDetails } from '@admin/products/model';

const priceFormatter = new Intl.NumberFormat('uk-UA', {
  style: 'currency',
  currency: 'UAH',
  maximumFractionDigits: 2,
});

interface ProductInformationCardProps {
  product: ProductDetails;
  publicUrl: string | null;
  photoStorageUrl: string;
  onAddProduct?: (productId: number) => void;
}

export function ProductInformationCard({
  product,
  publicUrl,
  photoStorageUrl,
  onAddProduct,
}: ProductInformationCardProps) {
  const hasStatus = product.inStock || product.isSale || product.isNew || product.exportToSite;

  return (
    <SectionCard as="article" eyebrow="Основна інформація" title={product.nameUk} titleVariant="h5">
      <Typography color="text.secondary" sx={{ mt: -1, overflowWrap: 'anywhere' }}>
        Російською: {product.nameRu}
      </Typography>
      {hasStatus && (
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
          {product.inStock && <StatusPill label="Наявність" tone="success" />}
          {product.isSale && <StatusPill label="Акція" tone="warning" />}
          {product.isNew && <StatusPill label="Новинка" tone="info" />}
          {product.exportToSite && <StatusPill label="На сайті" tone="neutral" />}
        </Stack>
      )}
      <Box>
        <Typography color="text.secondary" component="p" variant="caption">
          Ціна (роздріб)
        </Typography>
        <Typography component="p" sx={{ fontVariantNumeric: 'tabular-nums' }} variant="h4">
          {product.price === null ? 'Не вказано' : priceFormatter.format(product.price)}
        </Typography>
      </Box>
      <Divider />
      <DetailFieldList columns={2}>
        <DetailField label="ID" value={String(product.id)} />
        <DetailField label="Залишок" value={String(product.stock)} />
        <DetailField label="Категорія" value={product.categoryName || 'Не вказано'} />
        <DetailField label="Кількість в упаковці" value={String(product.quantityInPack)} />
      </DetailFieldList>
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.5} sx={{ pt: 1 }}>
        {onAddProduct && (
          <Button
            onClick={() => onAddProduct(product.id)}
            startIcon={<AddShoppingCartOutlinedIcon />}
            variant="contained"
          >
            Додати до замовлення
          </Button>
        )}
        {publicUrl && (
          <Button
            component="a"
            href={publicUrl}
            rel="noopener noreferrer"
            startIcon={<OpenInNewIcon />}
            target="_blank"
            variant="outlined"
          >
            Відкрити на сайті
          </Button>
        )}
        <Button
          component="a"
          href={photoStorageUrl}
          rel="noopener noreferrer"
          target="_blank"
          variant="text"
        >
          Сховище фото
        </Button>
      </Stack>
    </SectionCard>
  );
}
