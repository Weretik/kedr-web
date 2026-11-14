import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { Box, Button, Stack, Typography } from '@mui/material';

import { ProductThumb } from '../../../components/display/product-thumb';
import { SiteProblemPills } from '../../../components/display/site-problem-pills';
import { SiteModelAxisPicker } from '../axes/site-model-axis-picker';

import type {
  AttributeValueOption,
  SiteModelAxis,
  SiteModelProduct,
} from '@admin/site-models/model';

export interface SiteModelProductsCardProps {
  axes: readonly SiteModelAxis[];
  products: readonly SiteModelProduct[];
  /** List values of each axis by attribute id, for the pickers. */
  axisValues: Readonly<Record<number, readonly AttributeValueOption[]>>;
  busy: boolean;
  error: string | null;
  onSetValue: (productId: number, attributeId: number, valueId: number) => void;
  /** Adds a value with this name to the attribute and returns its id. */
  onCreateValue: (attributeId: number, name: string) => Promise<number | undefined>;
  onEditAttributes: (product: SiteModelProduct) => void;
  onRemove: (product: SiteModelProduct) => void;
  onFillFromNames: () => void;
  onAdd: () => void;
}

/** One product of the model: photo, name, axis pickers, problems, and actions. */
export function SiteModelProductRow(
  props: SiteModelProductsCardProps & { product: SiteModelProduct; first: boolean },
) {
  const { axes, axisValues, busy, first, product } = props;
  return (
    <Box
      component="li"
      sx={{
        borderColor: 'divider',
        borderTop: first ? 0 : 1,
        display: 'grid',
        gap: 2,
        gridTemplateColumns: '112px minmax(0, 1fr)',
        pb: 2,
        pt: first ? 0.5 : 2,
      }}
    >
      <ProductThumb size={112} src={product.photo} />
      <Stack spacing={1.25} sx={{ minWidth: 0 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, overflowWrap: 'anywhere' }} variant="body1">
            {product.name}
          </Typography>
          <Typography color="text.secondary" variant="caption">
            Код 1С {product.productId}
            {product.isMain ? ' · головний' : ''}
            {product.exportToSite ? '' : ' · не на сайті'}
          </Typography>
        </Box>
        {axes.length > 0 ? (
          <Box
            sx={{
              display: 'grid',
              gap: 1.25,
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 220px))',
            }}
          >
            {axes.map((axis) => (
              <SiteModelAxisPicker
                axis={axis}
                busy={busy}
                key={axis.attributeId}
                loaded={axisValues[axis.attributeId] ?? []}
                onCreateValue={props.onCreateValue}
                onSetValue={props.onSetValue}
                product={product}
              />
            ))}
          </Box>
        ) : null}
        <Stack
          direction="row"
          sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}
          useFlexGap
        >
          <SiteProblemPills problems={product.problems} />
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, ml: 'auto' }} useFlexGap>
            <Button
              aria-label={`Усі ознаки товару ${product.name}`}
              color="inherit"
              onClick={() => props.onEditAttributes(product)}
              size="small"
              startIcon={<EditOutlinedIcon />}
              variant="outlined"
            >
              Усі ознаки
            </Button>
            <Button
              aria-label={`Прибрати з моделі: ${product.name}`}
              color="error"
              disabled={busy}
              onClick={() => props.onRemove(product)}
              size="small"
              startIcon={<RemoveCircleOutlineOutlinedIcon />}
              variant="outlined"
            >
              Прибрати
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
