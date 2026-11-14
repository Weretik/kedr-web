import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { Button, Stack } from '@mui/material';

interface SiteModelReviewBarProps {
  proposed: boolean;
  hasNext: boolean;
  busy: boolean;
  onNext: () => void;
  onAccept: () => void;
}

/** Sticky bottom bar: «Погодити і далі» and «Пропустити» for a proposal, «Далі» otherwise. */
export function SiteModelReviewBar({
  busy,
  hasNext,
  onAccept,
  onNext,
  proposed,
}: SiteModelReviewBarProps) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        bgcolor: 'background.paper',
        borderBottomLeftRadius: 'inherit',
        borderBottomRightRadius: 'inherit',
        borderColor: 'divider',
        borderTop: 1,
        bottom: 0,
        justifyContent: 'flex-end',
        position: 'sticky',
        px: { xs: 2, md: 3 },
        py: 1.5,
        zIndex: 1,
      }}
    >
      {proposed ? (
        <>
          <Button disabled={!hasNext || busy} onClick={onNext}>
            Пропустити
          </Button>
          <Button
            disabled={busy}
            endIcon={<ArrowForwardOutlinedIcon />}
            onClick={onAccept}
            variant="contained"
          >
            Погодити і далі
          </Button>
        </>
      ) : (
        <Button disabled={!hasNext} endIcon={<ArrowForwardOutlinedIcon />} onClick={onNext}>
          Далі
        </Button>
      )}
    </Stack>
  );
}
