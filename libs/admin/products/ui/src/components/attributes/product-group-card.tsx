import { variantText } from '@admin/products/model';
import { SectionCard, StatusPill } from '@admin/shared/ui';
import StarIcon from '@mui/icons-material/Star';
import { Alert, Box, Button, Stack, Tooltip, Typography } from '@mui/material';

import type { ProductGroupMembership } from '@admin/products/model';

interface ProductGroupCardProps {
  membership: ProductGroupMembership;
  busy: boolean;
  error: string | null;
  onMove: () => void;
  onCreate: () => void;
  onRemove: () => void;
  onAutomatic: () => void;
  onSetMain: (productId: number) => void;
}

/**
 * «Група» of a product: its variants (main first) and the actions on it. A product a person placed stays where
 * it is until «Повернути автоматичне групування».
 */
export function ProductGroupCard({
  busy,
  error,
  membership,
  onAutomatic,
  onCreate,
  onMove,
  onRemove,
  onSetMain,
}: ProductGroupCardProps) {
  const { group, isPinned, productId } = membership;

  return (
    <SectionCard title={group ? `Група: ${group.name}` : 'Група'}>
      {group ? null : (
        <Typography color="text.secondary" variant="body2">
          {isPinned ? 'Товар вийнято з груп вручну.' : 'Товар не входить у групу варіантів.'}
        </Typography>
      )}
      {group ? (
        <Stack component="ul" spacing={0.5} sx={{ m: 0, p: 0 }}>
          {group.members.map((member) => (
            <Stack
              component="li"
              direction="row"
              key={member.productId}
              spacing={1}
              sx={{
                alignItems: 'center',
                bgcolor: member.productId === productId ? 'action.selected' : undefined,
                borderRadius: 1,
                listStyle: 'none',
                px: 1,
                py: 0.5,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ overflowWrap: 'anywhere' }} variant="body2">
                  {member.isMain ? (
                    <Tooltip title="Головний товар групи">
                      <StarIcon
                        aria-label="Головний"
                        color="warning"
                        sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }}
                      />
                    </Tooltip>
                  ) : null}
                  {member.name}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                  <Typography color="text.secondary" variant="caption">
                    ID {member.productId} · {variantText(member)}
                  </Typography>
                  {member.hasSameVariants ? (
                    <StatusPill label="Однакові варіанти" tone="error" />
                  ) : null}
                  {member.isDeleted ? <StatusPill label="Видалено в 1С" tone="error" /> : null}
                  {!member.exportToSite ? <StatusPill label="Не на сайті" tone="warning" /> : null}
                </Stack>
              </Box>
              {!member.isMain && member.exportToSite && !member.isDeleted ? (
                <Button disabled={busy} onClick={() => onSetMain(member.productId)} size="small">
                  Зробити головним
                </Button>
              ) : null}
            </Stack>
          ))}
        </Stack>
      ) : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
        <Button disabled={busy} onClick={onMove} size="small" variant="outlined">
          Перенести в іншу групу
        </Button>
        <Button disabled={busy} onClick={onCreate} size="small" variant="outlined">
          Нова група
        </Button>
        {group ? (
          <Button color="error" disabled={busy} onClick={onRemove} size="small">
            Видалити з групи
          </Button>
        ) : null}
        {isPinned ? (
          <Button disabled={busy} onClick={onAutomatic} size="small">
            Повернути автоматичне групування
          </Button>
        ) : null}
      </Stack>
    </SectionCard>
  );
}
