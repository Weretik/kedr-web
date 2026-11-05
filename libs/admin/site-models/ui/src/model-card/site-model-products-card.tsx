import { RowEditAction, SectionCard } from '@admin/shared/ui';
import { formatSitePrice } from '@admin/site-models/model';
import AddIcon from '@mui/icons-material/Add';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import {
  Alert,
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';

import { ProductThumb } from '../common/product-thumb';
import { SiteProblemPills } from '../common/site-problem-pills';

import type {
  AttributeValueOption,
  SiteModelAxis,
  SiteModelProduct,
} from '@admin/site-models/model';

interface SiteModelProductsCardProps {
  axes: readonly SiteModelAxis[];
  products: readonly SiteModelProduct[];
  /** List values of each axis by attribute id, for the cell pickers. */
  axisValues: Readonly<Record<number, readonly AttributeValueOption[]>>;
  busy: boolean;
  error: string | null;
  onSetValue: (productId: number, attributeId: number, valueId: number) => void;
  onEditAttributes: (product: SiteModelProduct) => void;
  onRemove: (product: SiteModelProduct) => void;
  onFillFromNames: () => void;
  onAdd: () => void;
}

/** The products of a model with their axis values; an empty value of an on-site product is a problem. */
export function SiteModelProductsCard(props: SiteModelProductsCardProps) {
  const { axes, axisValues, busy, products } = props;
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
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 640 }}>
          <TableHead>
            <TableRow>
              <TableCell>Товар</TableCell>
              {axes.map((axis) => (
                <TableCell key={axis.attributeId}>{axis.name}</TableCell>
              ))}
              <TableCell align="right">Ціна</TableCell>
              <TableCell>Чого бракує</TableCell>
              <TableCell align="right">Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.productId}>
                <TableCell>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <ProductThumb size={40} src={product.photo} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ overflowWrap: 'anywhere' }} variant="body2">
                        {product.name}
                      </Typography>
                      <Typography color="text.secondary" variant="caption">
                        Код 1С {product.productId}
                        {product.isMain ? ' · головний' : ''}
                        {product.exportToSite ? '' : ' · не на сайті'}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                {axes.map((axis) => {
                  const value = product.values.find(
                    (item) => item.attributeId === axis.attributeId,
                  );
                  const options = axisValues[axis.attributeId] ?? [];
                  return (
                    <TableCell key={axis.attributeId}>
                      <Select
                        aria-label={`${axis.name}: ${product.name}`}
                        disabled={busy || options.length === 0}
                        displayEmpty
                        error={!value?.valueId && product.exportToSite}
                        onChange={(event) =>
                          props.onSetValue(
                            product.productId,
                            axis.attributeId,
                            Number(event.target.value),
                          )
                        }
                        renderValue={() => value?.name ?? '—'}
                        size="small"
                        sx={{ minWidth: 120 }}
                        value={value?.valueId ? String(value.valueId) : ''}
                      >
                        {options.map((option) => (
                          <MenuItem key={option.id} value={String(option.id)}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  );
                })}
                <TableCell align="right">{formatSitePrice(product.retailPrice)}</TableCell>
                <TableCell>
                  <SiteProblemPills problems={product.problems} />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                    <RowEditAction
                      label={`Усі ознаки товару ${product.name}`}
                      onEdit={() => props.onEditAttributes(product)}
                      title="Усі ознаки"
                    />
                    <Tooltip title="Прибрати з моделі">
                      <span>
                        <IconButton
                          aria-label={`Прибрати з моделі: ${product.name}`}
                          disabled={busy}
                          onClick={() => props.onRemove(product)}
                          size="small"
                        >
                          <RemoveCircleOutlineOutlinedIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </SectionCard>
  );
}
