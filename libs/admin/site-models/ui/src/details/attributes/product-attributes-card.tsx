import { SectionCard, StatusPill } from '@admin/shared/ui';
import { attributeValueText, isManualAttribute } from '@admin/site-models/model';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Alert, Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import type { ProductAttribute, ProductAttributes } from '@admin/site-models/model';

interface ProductAttributesCardProps {
  data: ProductAttributes;
  busy: boolean;
  error: string | null;
  onEdit: (attribute: ProductAttribute) => void;
  onAdd: () => void;
  onRestore: (attribute: ProductAttribute) => void;
}

/**
 * «Ознаки» of a product: the original 1C name (read-only) and each attribute with its values. A value a
 * person set shows a lock; «Повернути автоматичне» drops it. Only problems are marked.
 */
export function ProductAttributesCard({
  busy,
  data,
  error,
  onAdd,
  onEdit,
  onRestore,
}: ProductAttributesCardProps) {
  return (
    <SectionCard
      action={
        <Button disabled={busy} onClick={onAdd} size="small" startIcon={<AddIcon />}>
          Додати
        </Button>
      }
      title="Ознаки"
    >
      <Box>
        <Typography color="text.secondary" variant="caption">
          Назва з 1С (не змінюється)
        </Typography>
        <Typography sx={{ overflowWrap: 'anywhere' }} variant="body2">
          {data.originalName}
        </Typography>
      </Box>
      {error ? <Alert severity="error">{error}</Alert> : null}
      {data.attributes.length === 0 ? (
        <Typography color="text.secondary" variant="body2">
          Ознаки ще не розпізнано.
        </Typography>
      ) : (
        <Stack
          component="ul"
          divider={<Box sx={{ borderTop: 1, borderColor: 'divider' }} />}
          sx={{ m: 0, p: 0 }}
        >
          {data.attributes.map((attribute) => {
            const manual = isManualAttribute(attribute);
            const unconfirmed = attribute.values.some((value) => !value.isConfirmed);
            return (
              <Stack
                component="li"
                direction="row"
                key={attribute.attributeId}
                spacing={1}
                sx={{ alignItems: 'center', listStyle: 'none', py: 1 }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography color="text.secondary" variant="caption">
                    {attribute.name}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center', flexWrap: 'wrap' }}
                  >
                    <Typography sx={{ overflowWrap: 'anywhere' }} variant="body2">
                      {attributeValueText(attribute)}
                    </Typography>
                    {manual ? (
                      <Tooltip title="Задано вручну: автоматика це не змінює">
                        <LockOutlinedIcon
                          aria-label="Задано вручну"
                          color="action"
                          fontSize="small"
                        />
                      </Tooltip>
                    ) : null}
                    {unconfirmed ? (
                      <StatusPill label="Розшифровку не підтверджено" tone="warning" />
                    ) : null}
                  </Stack>
                </Box>
                {manual ? (
                  <Button disabled={busy} onClick={() => onRestore(attribute)} size="small">
                    Повернути автоматичне
                  </Button>
                ) : null}
                <Tooltip title="Змінити">
                  <span>
                    <IconButton
                      aria-label={`Змінити: ${attribute.name}`}
                      disabled={busy}
                      onClick={() => onEdit(attribute)}
                      size="small"
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            );
          })}
        </Stack>
      )}
    </SectionCard>
  );
}
