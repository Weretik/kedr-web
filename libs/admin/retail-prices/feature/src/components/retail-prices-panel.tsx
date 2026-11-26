import { AdminEditPanel, NoticeSnackbar } from '@admin/shared/ui';
import { Alert } from '@mui/material';

import { RetailPriceResult } from './retail-price-result';
import { RetailPriceStatus } from './retail-price-status';
import { RetailPriceUpload } from './retail-price-upload';
import { useRetailPricesPanel } from '../hooks/use-retail-prices-panel';

interface RetailPricesPanelProps {
  open: boolean;
  onClose: () => void;
}

/** «Роздрібні ціни з файлу»: the site's retail prices from the 1C price list (spec R-001…R-006). */
export function RetailPricesPanel({ onClose, open }: RetailPricesPanelProps) {
  const panel = useRetailPricesPanel(open);

  return (
    <>
      <AdminEditPanel
        busy={panel.busy}
        onClose={onClose}
        open={open}
        subtitle={panel.status?.priceTypeName}
        title="Роздрібні ціни з файлу"
      >
        <RetailPriceStatus
          busy={panel.busy}
          onRetry={() => void panel.retryStatus()}
          onUnlock={() => void panel.unlock()}
          status={panel.status}
          statusError={panel.statusError}
        />
        <RetailPriceUpload
          busy={panel.busy}
          file={panel.file}
          onChooseFile={panel.chooseFile}
          onProtectChange={panel.setProtectFromOneC}
          onUpload={() => void panel.upload()}
          priceTypeName={panel.status?.priceTypeName ?? ''}
          protectFromOneC={panel.protectFromOneC}
          uploading={panel.uploading}
        />
        {panel.error ? <Alert severity="error">{panel.error}</Alert> : null}
        {panel.result ? <RetailPriceResult result={panel.result} /> : null}
      </AdminEditPanel>
      <NoticeSnackbar message={panel.notice} onClose={panel.clearNotice} />
    </>
  );
}
