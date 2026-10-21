import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { IconButton, Tooltip } from '@mui/material';

import type { AdminProductListItem } from '@admin/products/model';

interface ProductsViewActionCellProps {
  product: AdminProductListItem;
  onView: (product: AdminProductListItem) => void;
  onAdd?: (product: AdminProductListItem) => void;
}

export function ProductsViewActionCell({ product, onView, onAdd }: ProductsViewActionCellProps) {
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
    {onAdd && <Tooltip title="Додати до поточного набору"><IconButton aria-label={`Додати товар ${product.nameUk} до поточного набору`} onClick={() => onAdd(product)} size="small"><AddShoppingCartOutlinedIcon fontSize="small" /></IconButton></Tooltip>}
    </>
  );
}
