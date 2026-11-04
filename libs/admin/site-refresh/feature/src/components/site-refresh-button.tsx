import { NoticeSnackbar } from '@admin/shared/ui';
import { useRefreshSiteMutation } from '@admin/site-refresh/data-access';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';

import { siteRefreshedMessage, siteRefreshErrorMessage } from '../messages/site-refresh-messages';

/** Top bar button: shows saved site content now instead of after the 10-minute cache. */
export function SiteRefreshButton() {
  const [refreshSite, { isLoading }] = useRefreshSiteMutation();
  const [notice, setNotice] = useState<string | null>(null);

  const refresh = async () => {
    try {
      await refreshSite().unwrap();
      setNotice(siteRefreshedMessage);
    } catch (error) {
      setNotice(siteRefreshErrorMessage(error));
    }
  };

  return (
    <>
      <Tooltip title="Оновити сайт зараз">
        <span>
          <IconButton
            aria-label="Оновити сайт зараз"
            disabled={isLoading}
            onClick={() => void refresh()}
          >
            {isLoading ? <CircularProgress size={20} /> : <SyncOutlinedIcon />}
          </IconButton>
        </span>
      </Tooltip>
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </>
  );
}
