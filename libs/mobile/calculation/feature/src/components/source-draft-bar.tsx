import { AppText, Button, createStyles, useStyles } from '@mobile/shared/ui';
import { View } from 'react-native';

/** The saved draft this calculation was opened from, with «Видалити чернетку». */
export function SourceDraftBar({
  onDelete,
  title,
}: Readonly<{ onDelete: () => void; title: string }>) {
  const styles = useStyles(stylesSheet);

  return (
    <View style={styles.draft}>
      <AppText style={styles.title} tone="secondary" variant="secondary">
        {`Чернетка «${title}»`}
      </AppText>
      <Button label="Видалити чернетку" onPress={onDelete} variant="text" />
    </View>
  );
}

const stylesSheet = createStyles((theme) => ({
  draft: { alignItems: 'center', flexDirection: 'row', gap: theme.space.sm },
  title: { flex: 1 },
}));
