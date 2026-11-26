import { SectionCard, StatusPill } from '@admin/shared/ui';
import AddIcon from '@mui/icons-material/Add';
import {
  Alert,
  Button,
  Link,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material';

import type { CategorySiteModel } from '@admin/categories/model';

interface CategorySiteModelsCardProps {
  models: readonly CategorySiteModel[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  /** Editors only: opens «Додати моделі в категорію». */
  onAdd?: () => void;
}

/** «Моделі на сайті» of a final category: the models placed in it, each a link to its page (spec 002 R-006). */
export function CategorySiteModelsCard({
  error,
  loading,
  models,
  onAdd,
  onRetry,
}: CategorySiteModelsCardProps) {
  return (
    <SectionCard
      action={
        onAdd ? (
          <Button onClick={onAdd} startIcon={<AddIcon />} variant="outlined">
            Додати моделі
          </Button>
        ) : undefined
      }
      title={loading || error ? 'Моделі на сайті' : `Моделі на сайті · ${models.length}`}
    >
      {loading ? (
        <Skeleton aria-label="Завантаження моделей" height={96} variant="rounded" />
      ) : error ? (
        <Alert action={<Button onClick={onRetry}>Повторити</Button>} severity="error">
          Не вдалося завантажити моделі категорії.
        </Alert>
      ) : models.length === 0 ? (
        <Typography color="text.secondary" variant="body2">
          У цій категорії ще немає моделей.
        </Typography>
      ) : (
        <List dense disablePadding>
          {models.map((model) => (
            <ListItem
              disableGutters
              key={model.id}
              secondaryAction={
                model.isProposed ? <StatusPill label="Не перевірена" tone="info" /> : null
              }
            >
              <ListItemText
                primary={<Link href={`/site-models/${model.id}`}>{model.name}</Link>}
                secondary={`Товарів: ${model.productCount}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </SectionCard>
  );
}
