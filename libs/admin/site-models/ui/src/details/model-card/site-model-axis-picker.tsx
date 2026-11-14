import { axisValueOptions } from '@admin/site-models/model';
import { Stack, Typography } from '@mui/material';

import { CreatablePicker } from '../../components/creatable-picker';

import type {
  AttributeValueOption,
  SiteModelAxis,
  SiteModelProduct,
} from '@admin/site-models/model';

interface SiteModelAxisPickerProps {
  axis: SiteModelAxis;
  product: SiteModelProduct;
  /** Loaded list values of the axis attribute. */
  loaded: readonly AttributeValueOption[];
  busy: boolean;
  onSetValue: (productId: number, attributeId: number, valueId: number) => void;
  onCreateValue: (attributeId: number, name: string) => Promise<number | undefined>;
}

/** The value of one axis for a product; a typed value nothing matches offers «Створити значення». */
export function SiteModelAxisPicker({
  axis,
  busy,
  loaded,
  onCreateValue,
  onSetValue,
  product,
}: SiteModelAxisPickerProps) {
  const value = product.values.find((item) => item.attributeId === axis.attributeId);
  return (
    <Stack spacing={0.5} sx={{ minWidth: 0 }}>
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
        onCreate={(name) => onCreateValue(axis.attributeId, name)}
        onPick={(valueId) => onSetValue(product.productId, axis.attributeId, valueId)}
        options={axisValueOptions(loaded, value)}
        value={value?.valueId ?? null}
      />
    </Stack>
  );
}
