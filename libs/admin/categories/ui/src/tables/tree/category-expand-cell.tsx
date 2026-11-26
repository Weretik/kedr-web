import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IconButton } from '@mui/material';

interface CategoryExpandCellProps {
  name: string;
  open: boolean;
  onToggle: () => void;
}

/** The arrow that opens a category's subcategories right in the table (spec 003 R-001). */
export function CategoryExpandCell({ name, onToggle, open }: CategoryExpandCellProps) {
  return (
    <IconButton
      aria-expanded={open}
      aria-label={open ? `Згорнути: ${name}` : `Розгорнути: ${name}`}
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
