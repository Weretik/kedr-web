import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material';

import { ProductThumb } from '../../components/display/product-thumb';

import type { SiteProductCandidate } from '@admin/site-models/model';

interface ProductCandidateListProps {
  candidates: readonly SiteProductCandidate[];
  selectedIds: readonly number[];
  loading: boolean;
  emptyText: string;
  onToggle: (candidate: SiteProductCandidate) => void;
}

/** Products to pick for a model: photo, name, 1C code and category; a product of another model is locked. */
export function ProductCandidateList(props: ProductCandidateListProps) {
  if (props.loading)
    return <Skeleton aria-label="Завантаження товарів" height={160} variant="rounded" />;
  if (props.candidates.length === 0)
    return (
      <Typography color="text.secondary" variant="body2">
        {props.emptyText}
      </Typography>
    );
  return (
    <List aria-label="Товари" dense disablePadding>
      {props.candidates.map((item) => (
        <ListItem disablePadding key={item.productId}>
          <ListItemButton
            disabled={item.disabledReason !== null}
            onClick={() => props.onToggle(item)}
            sx={{ gap: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 0 }}>
              <Checkbox
                checked={props.selectedIds.includes(item.productId)}
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
                item.categoryName,
                item.disabledReason ?? item.note,
              ].join(' · ')}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
