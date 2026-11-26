import { StatusPill } from '@admin/shared/ui';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, Button, Stack, Typography } from '@mui/material';

import { ProductThumb } from '../../components/display/product-thumb';
import { SiteModelAxisPicker } from '../../details/model-card/axes/site-model-axis-picker';

import type {
  AttributeValueOption,
  SiteModelAxis,
  SiteModelProduct,
} from '@admin/site-models/model';

/** What it takes to fix a product's values right under its model (spec 001 R-002b). */
export interface SiteModelPreviewEditing {
  axes: readonly SiteModelAxis[];
  /** List values of each axis by attribute id. */
  axisValues: Readonly<Record<number, readonly AttributeValueOption[]>>;
  busy: boolean;
  error: string | null;
  onSetValue: (productId: number, attributeId: number, valueId: number) => void;
  onCreateValue: (attributeId: number, name: string) => Promise<number | undefined>;
  onEditAttributes: (product: SiteModelProduct) => void;
}

const price = (value: number | null) =>
  value === null ? '—' : `${value.toLocaleString('uk-UA')} грн`;

/** One product under an opened model: photo, name, code, price, site mark, and the switcher pickers. */
export function SiteModelPreviewItem({
  editing,
  product,
}: {
  product: SiteModelProduct;
  editing?: SiteModelPreviewEditing;
}) {
  return (
    <Stack component="li" spacing={1}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: '40px minmax(0, 1fr) auto auto',
        }}
      >
        <ProductThumb size={40} src={product.photo} />
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ overflowWrap: 'anywhere' }} variant="body2">
            {product.name}
          </Typography>
          <Typography color="text.secondary" variant="caption">
            Код {product.productId}
          </Typography>
        </Box>
        <Typography sx={{ fontVariantNumeric: 'tabular-nums' }} variant="body2">
          {price(product.retailPrice)}
        </Typography>
        {product.exportToSite ? (
          <StatusPill label="На сайті" tone="success" />
        ) : (
          <StatusPill label="Не на сайті" tone="neutral" />
        )}
      </Box>
      {editing ? (
        <Box
          sx={{
            alignItems: 'end',
            display: 'grid',
            gap: 1.25,
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 220px))',
            pl: 6.5,
          }}
        >
          {editing.axes.map((axis) => (
            <SiteModelAxisPicker
              axis={axis}
              busy={editing.busy}
              key={axis.attributeId}
              loaded={editing.axisValues[axis.attributeId] ?? []}
              onCreateValue={editing.onCreateValue}
              onSetValue={editing.onSetValue}
              product={product}
            />
          ))}
          <Button
            aria-label={`Усі ознаки товару ${product.name}`}
            color="inherit"
            onClick={() => editing.onEditAttributes(product)}
            size="small"
            startIcon={<EditOutlinedIcon />}
            sx={{ justifySelf: 'start' }}
            variant="outlined"
          >
            Усі ознаки
          </Button>
        </Box>
      ) : null}
    </Stack>
  );
}
