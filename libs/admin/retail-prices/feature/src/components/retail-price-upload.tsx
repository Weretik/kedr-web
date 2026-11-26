import { SectionCard } from '@admin/shared/ui';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material';

import type { ChangeEvent } from 'react';

const excelTypes = '.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

interface RetailPriceUploadProps {
  priceTypeName: string;
  file: File | null;
  onChooseFile: (file: File | null) => void;
  protectFromOneC: boolean;
  onProtectChange: (value: boolean) => void;
  onUpload: () => void;
  uploading: boolean;
  busy: boolean;
}

/** The 1C price file, the 1C flag (on by default) and «Завантажити» (spec R-003). */
export function RetailPriceUpload({
  busy,
  file,
  onChooseFile,
  onProtectChange,
  onUpload,
  priceTypeName,
  protectFromOneC,
  uploading,
}: RetailPriceUploadProps) {
  const choose = (event: ChangeEvent<HTMLInputElement>) => {
    onChooseFile(event.target.files?.[0] ?? null);
    event.target.value = '';
  };

  return (
    <SectionCard title="Завантажити файл з 1С">
      <Stack spacing={2}>
        <Typography color="text.secondary" variant="body2">
          Потрібні колонки «Код» і «{priceTypeName || 'роздрібна ціна'}»; змінюється лише цей тип
          ціни.
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{ alignItems: { sm: 'center' } }}
        >
          <Button
            component="label"
            disabled={busy}
            startIcon={<UploadFileOutlinedIcon />}
            variant="outlined"
          >
            Вибрати файл .xlsx
            <input
              accept={excelTypes}
              aria-label="Файл з цінами"
              hidden
              onChange={choose}
              type="file"
            />
          </Button>
          <Typography sx={{ overflowWrap: 'anywhere' }} variant="body2">
            {file ? file.name : 'Файл не вибрано'}
          </Typography>
        </Stack>
        <FormControlLabel
          control={
            <Checkbox
              checked={protectFromOneC}
              disabled={busy}
              onChange={(event) => onProtectChange(event.target.checked)}
            />
          }
          label="Не оновлювати з 1С ціни, завантажені файлом"
        />
        <Button
          disabled={!file || busy}
          onClick={onUpload}
          startIcon={uploading ? <CircularProgress color="inherit" size={18} /> : undefined}
          sx={{ alignSelf: 'flex-start', minHeight: 44 }}
          variant="contained"
        >
          Завантажити
        </Button>
      </Stack>
    </SectionCard>
  );
}
