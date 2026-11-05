import { NoticeSnackbar } from '@admin/shared/ui';
import { useRefreshSiteMutation } from '@admin/site-refresh/data-access';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import { Button, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';

import { siteRefreshedMessage, siteRefreshErrorMessage } from '../messages/site-refresh-messages';

/**
 * Shows saved site content now instead of after the 10-minute cache: an icon in the top bar, or a labelled button
 * on a page such as «Огляд».
 */
export function SiteRefreshButton({ variant = 'icon' }: { variant?: 'icon' | 'text' }) {
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

  const noticeSnackbar = <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />;

  if (variant === 'text') {
    return (
      <>
        <Button
          disabled={isLoading}
          onClick={() => void refresh()}
          startIcon={
            isLoading ? <CircularProgress color="inherit" size={18} /> : <SyncOutlinedIcon />
          }
          sx={{ minHeight: 44 }}
          variant="contained"
        >
          Оновити сайт зараз
        </Button>
        {noticeSnackbar}
      </>
    );
  }

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
      {noticeSnackbar}
    </>
  );
}
