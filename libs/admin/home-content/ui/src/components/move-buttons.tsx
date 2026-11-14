import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { IconButton, Tooltip } from '@mui/material';

interface MoveButtonsProps {
  /** Name in the button labels, for screen readers. */
  name: string;
  index: number;
  count: number;
  disabled: boolean;
  onMove: (to: number) => void;
  /** A list moves up and down, a row of logos left and right. */
  orientation?: 'vertical' | 'horizontal';
}

const labels = {
  vertical: { back: 'вище', forward: 'нижче', Back: ArrowUpwardIcon, Forward: ArrowDownwardIcon },
  horizontal: {
    back: 'раніше',
    forward: 'пізніше',
    Back: ArrowBackIcon,
    Forward: ArrowForwardIcon,
  },
} as const;

const capitalize = (text: string) => text[0].toUpperCase() + text.slice(1);

/** «Вище» / «Нижче» (or «Раніше» / «Пізніше») for one entry; the first cannot go back and the last forward. */
export function MoveButtons({
  count,
  disabled,
  index,
  name,
  onMove,
  orientation = 'vertical',
}: MoveButtonsProps) {
  const { Back, Forward, back, forward } = labels[orientation];
  return (
    <>
      <Tooltip title={capitalize(back)}>
        <span>
          <IconButton
            aria-label={`Перемістити «${name}» ${back}`}
            disabled={disabled || index === 0}
            onClick={() => onMove(index - 1)}
            size="small"
          >
            <Back fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={capitalize(forward)}>
        <span>
          <IconButton
            aria-label={`Перемістити «${name}» ${forward}`}
            disabled={disabled || index === count - 1}
            onClick={() => onMove(index + 1)}
            size="small"
          >
            <Forward fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
}
