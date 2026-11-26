import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { Button } from '@mui/material';
import { useState } from 'react';

import { RetailPricesPanel } from './retail-prices-panel';

/** «Завантажити роздрібні ціни» in the «Каталог товарів» header; opens the panel (spec R-001). */
export function RetailPricesButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        startIcon={<UploadFileOutlinedIcon />}
        sx={{ minHeight: 44 }}
        variant="outlined"
      >
        Завантажити роздрібні ціни
      </Button>
      <RetailPricesPanel onClose={() => setOpen(false)} open={open} />
    </>
  );
}
