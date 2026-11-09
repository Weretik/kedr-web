import { useAllPhotosDownload } from '@mobile/catalog/data-access';
import { AppText, Button, Card, createStyles, useStyles } from '@mobile/shared/ui';

export interface PhotoDownloadCardProps {
  isOnline: boolean | null;
  isUnmetered: boolean;
}

/**
 * «Завантажити всі фото»: every product photo for work without a network (R-008). Main photos and schemes are kept
 * on Wi‑Fi without asking; this adds the rest.
 */
export function PhotoDownloadCard({ isOnline, isUnmetered }: Readonly<PhotoDownloadCardProps>) {
  const styles = useStyles(stylesSheet);
  const download = useAllPhotosDownload();
  const running = download.status === 'running';

  const note = running
    ? `Завантажено ${download.done} з ${download.total}`
    : download.isComplete
      ? 'Усі фото вже на пристрої.'
      : download.status === 'stopped'
        ? `Зупинено: ${download.done} з ${download.total}`
        : download.status === 'done' && download.failedBatches > 0
          ? 'Частину фото не вдалося завантажити. Спробуйте ще раз.'
          : isUnmetered
            ? 'Головні фото і схеми вже зберігаються через Wi‑Fi.'
            : 'Без Wi‑Fi фото завантажуються через мобільний інтернет.';

  return (
    <Card style={styles.card}>
      <AppText variant="bodyStrong">Фото для роботи без мережі</AppText>
      <AppText tone="secondary" variant="secondary">
        {note}
      </AppText>
      {running ? (
        <Button label="Зупинити" onPress={download.stop} variant="outlined" />
      ) : (
        <Button
          disabled={isOnline !== true}
          label="Завантажити всі фото"
          onPress={download.start}
          variant="outlined"
        />
      )}
    </Card>
  );
}

const stylesSheet = createStyles((theme) => ({
  card: { gap: theme.space.sm },
}));
