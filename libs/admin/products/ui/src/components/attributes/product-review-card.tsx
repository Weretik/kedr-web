import { problemLabel } from '@admin/products/model';
import { formatChanged, SectionCard, StatusPill } from '@admin/shared/ui';
import { Alert, Button, Stack, Typography } from '@mui/material';

import type { ProductReview } from '@admin/products/model';

interface ProductReviewCardProps {
  review: ProductReview;
  busy: boolean;
  error: string | null;
  onAccept: () => void;
  onReopen: () => void;
}

/**
 * «Перевірка»: why the product needs a person. «Прийняти як є» is permanent until «Повернути на перевірку».
 * Nothing is shown for a product without reasons.
 */
export function ProductReviewCard({
  busy,
  error,
  onAccept,
  onReopen,
  review,
}: ProductReviewCardProps) {
  if (review.reasons.length === 0 && review.state !== 'accepted') return null;
  const accepted = review.state === 'accepted';

  return (
    <SectionCard
      action={
        accepted ? (
          <Button disabled={busy} onClick={onReopen} size="small">
            Повернути на перевірку
          </Button>
        ) : (
          <Button disabled={busy} onClick={onAccept} size="small" variant="contained">
            Прийняти як є
          </Button>
        )
      }
      title="Перевірка"
    >
      {accepted ? (
        <Typography color="text.secondary" variant="body2">
          Прийнято як є
          {review.acceptedAt ? ` · ${formatChanged(review.acceptedAt, review.acceptedBy)}` : ''}
        </Typography>
      ) : null}
      <Stack component="ul" spacing={1} sx={{ m: 0, p: 0 }}>
        {review.reasons.map((reason) => (
          <Stack component="li" key={reason.code} spacing={0.5} sx={{ listStyle: 'none' }}>
            <span>
              <StatusPill label={problemLabel(reason)} tone={accepted ? 'neutral' : 'error'} />
            </span>
            {reason.text ? (
              <Typography color="text.secondary" variant="body2">
                {reason.text}
              </Typography>
            ) : null}
          </Stack>
        ))}
      </Stack>
      {error ? <Alert severity="error">{error}</Alert> : null}
    </SectionCard>
  );
}
