import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Box, InputAdornment, Stack } from '@mui/material';
import { GridToolbarContainer, QuickFilter, QuickFilterControl } from '@mui/x-data-grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import { createContext, useContext } from 'react';

export interface OrderGridToolbarProps {
  mode: 'orders' | 'drafts'; search: string; onSearch: (value: string) => void;
  createdFrom: string; createdTo: string; hideSearch: boolean;
  onDateChange: (from: string, to: string) => void;
}

export const OrderGridToolbarContext = createContext<OrderGridToolbarProps | null>(null);

export function OrderGridToolbar() {
  const props = useContext(OrderGridToolbarContext);
  if (!props) return null;
  return <GridToolbarContainer sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
    <LocalizationProvider adapterLocale="uk" dateAdapter={AdapterDayjs}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: '100%', flexWrap: 'wrap' }}>
        {!props.hideSearch && <Box sx={{ flex: '1 1 280px', maxWidth: 380 }}>
          <QuickFilter debounceMs={0} expanded parser={(value) => value.trim() ? [value.trim()] : []}>
            <QuickFilterControl
              fullWidth
              onChange={(event) => props.onSearch((event.target as HTMLInputElement).value)}
              placeholder={props.mode === 'orders' ? 'Пошук за номером або клієнтом' : 'Пошук за назвою або клієнтом'}
              size="small"
              slotProps={{
                htmlInput: { 'aria-label': props.mode === 'orders' ? 'Пошук за номером або клієнтом' : 'Пошук за назвою або клієнтом' },
                input: { startAdornment: <InputAdornment position="start"><SearchOutlinedIcon aria-hidden="true" fontSize="small" /></InputAdornment> },
              }}
            />
          </QuickFilter>
        </Box>}
        <DatePicker
          label="Дата від"
          onChange={(value, context) => { if (!value || context.validationError === null) props.onDateChange(value?.format('YYYY-MM-DD') ?? '', props.createdTo); }}
          slotProps={{ textField: { size: 'small' } }}
          value={props.createdFrom ? dayjs(props.createdFrom) : null}
        />
        <DatePicker
          label="Дата до"
          onChange={(value, context) => { if (!value || context.validationError === null) props.onDateChange(props.createdFrom, value?.format('YYYY-MM-DD') ?? ''); }}
          slotProps={{ textField: { size: 'small' } }}
          value={props.createdTo ? dayjs(props.createdTo) : null}
        />
      </Stack>
    </LocalizationProvider>
  </GridToolbarContainer>;
}
