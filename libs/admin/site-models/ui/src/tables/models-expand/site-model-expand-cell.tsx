import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IconButton } from '@mui/material';

interface SiteModelExpandCellProps {
  name: string;
  open: boolean;
  onToggle: () => void;
}

/** The arrow that opens a model's products right in «Моделі» (spec 001 R-002a). */
export function SiteModelExpandCell({ name, onToggle, open }: SiteModelExpandCellProps) {
  return (
    <IconButton
      aria-expanded={open}
      aria-label={open ? `Сховати товари: ${name}` : `Показати товари: ${name}`}
      onClick={onToggle}
      size="small"
    >
      {open ? (
        <KeyboardArrowDownIcon fontSize="small" />
      ) : (
        <KeyboardArrowRightIcon fontSize="small" />
      )}
    </IconButton>
  );
}
