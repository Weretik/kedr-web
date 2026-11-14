import { SectionCard } from '@admin/shared/ui';
import AddIcon from '@mui/icons-material/Add';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';

import { CreatablePicker } from '../../components/creatable-picker';
import { ProductThumb } from '../../components/product-thumb';
import { SiteProblemPills } from '../../components/site-problem-pills';

import type {
  AttributeValueOption,
  SiteModelAxis,
  SiteModelProduct,
} from '@admin/site-models/model';

interface SiteModelProductsCardProps {
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

/**
 * The products of a model, one row each: a large photo, the full name on top, the axis
 * pickers under it (a typed value nothing matches offers «Створити значення»), then «Чого
 * бракує» and the actions. An empty value of an on-site product is a problem.
 */
export function SiteModelProductsCard(props: SiteModelProductsCardProps) {
  const { axes, busy, products } = props;
  return (
    <SectionCard
      action={
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }} useFlexGap>
          <Button
            disabled={busy || axes.length === 0}
            onClick={props.onFillFromNames}
            size="small"
            startIcon={<AutoFixHighOutlinedIcon />}
          >
            Заповнити з назв
          </Button>
          <Button disabled={busy} onClick={props.onAdd} size="small" startIcon={<AddIcon />}>
            Додати товар
          </Button>
        </Stack>
      }
      title={`Товари моделі (${products.length})`}
    >
      {props.error ? <Alert severity="error">{props.error}</Alert> : null}
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
        {products.map((product, index) => (
          <ProductRow first={index === 0} key={product.productId} product={product} {...props} />
        ))}
      </Box>
    </SectionCard>
  );
}

function ProductRow(
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
            {axes.map((axis) => {
              const value = product.values.find((item) => item.attributeId === axis.attributeId);
              const loaded = axisValues[axis.attributeId] ?? [];
              // The product's own value stays shown while the attribute's values load.
              const options =
                value?.valueId && !loaded.some((option) => option.id === value.valueId)
                  ? [...loaded, { id: value.valueId, name: value.name ?? '' }]
                  : loaded;
              return (
                <Stack key={axis.attributeId} spacing={0.5} sx={{ minWidth: 0 }}>
                  <Typography
                    color="text.secondary"
                    sx={{ fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}
                    variant="caption"
                  >
                    {axis.name}
                  </Typography>
                  <CreatablePicker
                    ariaLabel={`${axis.name}: ${product.name}`}
                    createText="Створити значення"
                    disabled={busy}
                    emptyText="—"
                    error={!value?.valueId && product.exportToSite}
                    onCreate={(name) => props.onCreateValue(axis.attributeId, name)}
                    onPick={(valueId) =>
                      props.onSetValue(product.productId, axis.attributeId, valueId)
                    }
                    options={options}
                    value={value?.valueId ?? null}
                  />
                </Stack>
              );
            })}
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
