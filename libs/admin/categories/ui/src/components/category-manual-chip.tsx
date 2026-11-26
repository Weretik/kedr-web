import { Chip } from '@mui/material';

/** «Створена вручну»: a category made in the admin, not by 1C (spec 002 R-002). */
export function CategoryManualChip({ isManual }: { isManual: boolean }) {
  return isManual ? (
    <Chip color="info" label="Створена вручну" size="small" variant="outlined" />
  ) : null;
}
