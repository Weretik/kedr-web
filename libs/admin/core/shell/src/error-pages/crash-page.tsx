import { Button } from '@mui/material';

import { ErrorScreen } from './error-screen';

interface CrashPageProps {
  fullScreen?: boolean;
  onRetry: () => void;
}

/** 500 for a screen that failed while rendering; the layout around it keeps working. */
export function CrashPage({ fullScreen = false, onRetry }: CrashPageProps) {
  return (
    <ErrorScreen
      actions={
        <>
          <Button onClick={onRetry} variant="contained">
            Спробувати ще раз
          </Button>
          <Button href="/" variant="outlined">
            На головну
          </Button>
        </>
      }
      code="500"
      description="Сталася неочікувана помилка. Спробуйте ще раз; якщо вона повториться, повідомте адміністратора."
      fullScreen={fullScreen}
      title="Щось пішло не так"
    />
  );
}
