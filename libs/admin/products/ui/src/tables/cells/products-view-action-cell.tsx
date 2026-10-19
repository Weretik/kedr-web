import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { IconButton, Tooltip } from '@mui/material';

import type { AdminProductListItem } from '@admin/products/model';

interface ProductsViewActionCellProps {
  product: AdminProductListItem;
  onView: (product: AdminProductListItem) => void;
}

export function ProductsViewActionCell({ product, onView }: ProductsViewActionCellProps) {
  return (
    <Tooltip title="Переглянути товар">
      <IconButton
        aria-label={`Переглянути товар ${product.nameUk}, ID ${product.id}`}
        onClick={() => onView(product)}
        size="small"
      >
        <VisibilityOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
