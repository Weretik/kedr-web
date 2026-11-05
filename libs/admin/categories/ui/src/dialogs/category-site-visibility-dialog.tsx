import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import type { AdminCategory } from '@admin/categories/model';

interface CategorySiteVisibilityDialogProps {
  category: AdminCategory;
  /** Subcategories at every depth. */
  descendantCount: number;
  submitting: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Confirms showing or hiding a category on the site; the change takes its subcategories along. */
export function CategorySiteVisibilityDialog({
  category,
  descendantCount,
  error,
  onCancel,
  onConfirm,
  submitting,
}: CategorySiteVisibilityDialogProps) {
  const hiding = category.isShownOnSite;
  const branch = descendantCount > 0 ? ` разом з підкатегоріями (${descendantCount})` : '';
  const description = hiding
    ? `Категорія «${category.nameUk}»${branch} зникне з сайту, «Вітрини сайту» і «Моделей». Товари в 1С не зміняться.`
    : `Категорія «${category.nameUk}»${branch} з’явиться на сайті, у «Вітрині сайту» і «Моделях». Батьківські категорії теж стануть видимими.`;
  return (
    <Dialog fullWidth maxWidth="xs" onClose={submitting ? undefined : onCancel} open>
      <DialogTitle>{hiding ? 'Сховати з сайту?' : 'Показати на сайті?'}</DialogTitle>
      <DialogContent>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={submitting} onClick={onCancel}>
          Скасувати
        </Button>
        <Button
          color={hiding ? 'error' : 'primary'}
          disabled={submitting}
          onClick={onConfirm}
          variant="contained"
        >
          {hiding ? 'Сховати' : 'Показати'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
