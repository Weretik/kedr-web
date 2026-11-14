import { AdminEditPanel } from '@admin/shared/ui';
import {
  Alert,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { ProductThumb } from '../components/product-thumb';

import type { SiteShowcaseItem } from '@admin/site-models/model';

interface AddModelProductsPanelProps {
  open: boolean;
  categoryName: string;
  /** On-site products of the category in no model or in another proposal. */
  candidates: readonly SiteShowcaseItem[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onAdd: (productIds: number[]) => void;
}

/** «Додати товар»: the right-side panel to pick products of the model's category outside accepted models. */
export function AddModelProductsPanel(props: AddModelProductsPanelProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const toggle = (id: number) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  const close = () => {
    setSelected([]);
    props.onClose();
  };

  return (
    <AdminEditPanel
      actions={
        <>
          <Button disabled={props.saving} onClick={close}>
            Скасувати
          </Button>
          <Button
            disabled={props.saving || selected.length === 0}
            onClick={() => props.onAdd(selected)}
            variant="contained"
          >
            Додати{selected.length ? ` (${selected.length})` : ''}
          </Button>
        </>
      }
      busy={props.saving}
      onClose={close}
      open={props.open}
      subtitle={`Категорія «${props.categoryName}»`}
      title="Додати товари в модель"
    >
      {props.loading ? (
        <Skeleton aria-label="Завантаження товарів" height={160} variant="rounded" />
      ) : props.candidates.length === 0 ? (
        <Typography color="text.secondary" variant="body2">
          У категорії немає товарів поза прийнятими моделями.
        </Typography>
      ) : (
        <List dense disablePadding>
          {props.candidates.map((item) => (
            <ListItem disablePadding key={item.productId}>
              <ListItemButton onClick={() => toggle(item.productId)} sx={{ gap: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 0 }}>
                  <Checkbox
                    checked={selected.includes(item.productId)}
                    disableRipple
                    edge="start"
                    slotProps={{ input: { 'aria-label': item.name } }}
                    tabIndex={-1}
                  />
                </ListItemIcon>
                <ProductThumb size={40} src={item.photo} />
                <ListItemText
                  primary={item.name}
                  secondary={[
                    `Код 1С ${item.productId}`,
                    item.model ? `зараз у пропозиції «${item.model.name}»` : 'без моделі',
                  ].join(' · ')}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
      {props.error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {props.error}
        </Alert>
      ) : null}
    </AdminEditPanel>
  );
}
