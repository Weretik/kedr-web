import { DetailField, DetailFieldList } from '@admin/shared/ui';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Alert, Button, Stack } from '@mui/material';

interface CategoryPlaceViewProps {
  /** Site names of the ancestors; empty at the top level. */
  path: readonly string[];
  /** One-based place among neighbours and how many there are. */
  position: { index: number; total: number } | null;
  canMoveUp: boolean;
  canMoveDown: boolean;
  busy: boolean;
  error?: string;
  /** Administrators only: «Вище» / «Нижче» right away. */
  onMove?: (direction: 'up' | 'down') => void;
}

/** «Розташування» read-only with «Вище» / «Нижче» (spec 003 R-011). */
export function CategoryPlaceView(props: CategoryPlaceViewProps) {
  return (
    <Stack spacing={2}>
      <DetailFieldList columns={2}>
        <DetailField
          label="Вкладена в"
          value={props.path.length > 0 ? props.path.join(' › ') : 'Верхній рівень'}
        />
        <DetailField
          label="Місце серед сусідів"
          value={props.position ? `${props.position.index} з ${props.position.total}` : '—'}
        />
      </DetailFieldList>
      {props.error ? <Alert severity="error">{props.error}</Alert> : null}
      {props.onMove ? (
        <Stack direction="row" spacing={1}>
          <Button
            disabled={props.busy || !props.canMoveUp}
            onClick={() => props.onMove?.('up')}
            startIcon={<ArrowUpwardIcon />}
            variant="outlined"
          >
            Вище
          </Button>
          <Button
            disabled={props.busy || !props.canMoveDown}
            onClick={() => props.onMove?.('down')}
            startIcon={<ArrowDownwardIcon />}
            variant="outlined"
          >
            Нижче
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}
