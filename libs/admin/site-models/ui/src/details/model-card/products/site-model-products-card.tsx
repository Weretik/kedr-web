import { SectionCard } from '@admin/shared/ui';
import AddIcon from '@mui/icons-material/Add';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import { Alert, Box, Button, Stack } from '@mui/material';

import { SiteModelProductRow } from './site-model-product-row';

import type { SiteModelProductsCardProps } from './site-model-product-row';

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
          <SiteModelProductRow
            first={index === 0}
            key={product.productId}
            product={product}
            {...props}
          />
        ))}
      </Box>
    </SectionCard>
  );
}
