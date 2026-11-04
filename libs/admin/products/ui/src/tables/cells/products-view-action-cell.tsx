import { RowEditAction } from '@admin/shared/ui';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { IconButton, Tooltip } from '@mui/material';

import type { AdminProductListItem } from '@admin/products/model';

interface ProductsViewActionCellProps {
  product: AdminProductListItem;
  onView: (product: AdminProductListItem) => void;
  onEdit?: (product: AdminProductListItem) => void;
  onAdd?: (product: AdminProductListItem) => void;
}

/** «Дії» of a product row: view, edit in the side panel, and add to the current order set. */
export function ProductsViewActionCell({
  product,
  onView,
  onEdit,
  onAdd,
}: ProductsViewActionCellProps) {
  return (
    <>
      <Tooltip title="Переглянути товар">
        <IconButton
          aria-label={`Переглянути товар ${product.nameUk}, ID ${product.id}`}
          onClick={() => onView(product)}
          size="small"
        >
          <VisibilityOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      {onEdit && (
        <RowEditAction
          label={`Редагувати товар ${product.nameUk}, ID ${product.id}`}
          onEdit={() => onEdit(product)}
          title="Редагувати товар"
        />
      )}
      {onAdd && (
        <Tooltip title="Додати до поточного набору">
          <IconButton
            aria-label={`Додати товар ${product.nameUk} до поточного набору`}
            onClick={() => onAdd(product)}
            size="small"
            sx={{
              bgcolor: 'primary.light',
              color: 'primary.dark',
              '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' },
            }}
          >
            <AddShoppingCartOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
}
