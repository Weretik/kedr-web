import { SectionCard } from '@admin/shared/ui';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { lockedStatusText, unlockConfirmText } from '../model/retail-price-text';

import type { RetailPriceStatusDto } from '@admin/retail-prices/data-access';

interface RetailPriceStatusProps {
  status: RetailPriceStatusDto | undefined;
  statusError: boolean;
  onRetry: () => void;
  busy: boolean;
  onUnlock: () => void;
}

/** Which price type the site shows and how many of its prices 1C does not update (spec R-002, R-006). */
export function RetailPriceStatus({
  busy,
  onRetry,
  onUnlock,
  status,
  statusError,
}: RetailPriceStatusProps) {
  const [confirming, setConfirming] = useState(false);
  const locked = status ? lockedStatusText(status) : null;

  if (statusError)
    return (
      <Alert
        action={
          <Button color="inherit" onClick={onRetry} size="small">
            Повторити
          </Button>
        }
        severity="error"
      >
        Не вдалося завантажити стан цін.
      </Alert>
    );

  return (
    <SectionCard title="Ціни на сайті">
      <Stack spacing={1.5}>
        <Typography>
          Тип ціни: {status ? `«${status.priceTypeName || `№ ${status.priceTypeId}`}»` : '…'}
        </Typography>
        {locked ? (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            sx={{ alignItems: { sm: 'center' } }}
          >
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              {locked}
            </Typography>
            <Button disabled={busy} onClick={() => setConfirming(true)} variant="outlined">
              Повернути ціни під 1С
            </Button>
          </Stack>
        ) : null}
      </Stack>
      <Dialog onClose={() => setConfirming(false)} open={confirming && status !== undefined}>
        <DialogContent>
          <DialogContentText>{unlockConfirmText(status?.lockedCount ?? 0)}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirming(false)}>Скасувати</Button>
          <Button
            onClick={() => {
              setConfirming(false);
              onUnlock();
            }}
            variant="contained"
          >
            Повернути
          </Button>
        </DialogActions>
      </Dialog>
    </SectionCard>
  );
}
