import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import type { SiteShowcaseItem } from '@admin/site-models/model';

interface AddModelProductsDialogProps {
  categoryName: string;
  /** On-site products of the category outside accepted models. */
  candidates: readonly SiteShowcaseItem[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  onCancel: () => void;
  onAdd: (productIds: number[]) => void;
}

/** «Додати товар»: products of the model's category that are not in an accepted model yet. */
export function AddModelProductsDialog(props: AddModelProductsDialogProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const toggle = (id: number) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  return (
    <Dialog fullWidth maxWidth="sm" onClose={props.saving ? undefined : props.onCancel} open>
      <DialogTitle>Додати товари з категорії «{props.categoryName}»</DialogTitle>
      <DialogContent dividers>
        {props.loading ? (
          <Skeleton aria-label="Завантаження товарів" height={160} variant="rounded" />
        ) : props.candidates.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            У категорії немає товарів поза моделями.
          </Typography>
        ) : (
          <List dense disablePadding>
            {props.candidates.map((item) => (
              <ListItem disablePadding key={item.productId}>
                <ListItemButton onClick={() => toggle(item.productId)}>
                  <ListItemIcon>
                    <Checkbox
                      checked={selected.includes(item.productId)}
                      disableRipple
                      edge="start"
                      slotProps={{ input: { 'aria-label': item.name } }}
                      tabIndex={-1}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    secondary={[
                      `Код 1С ${item.productId}`,
                      item.model ? `зараз у пропозиції «${item.model.name}»` : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
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
      </DialogContent>
      <DialogActions>
        <Button disabled={props.saving} onClick={props.onCancel}>
          Скасувати
        </Button>
        <Button
          disabled={props.saving || selected.length === 0}
          onClick={() => props.onAdd(selected)}
          variant="contained"
        >
          Додати{selected.length ? ` (${selected.length})` : ''}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
