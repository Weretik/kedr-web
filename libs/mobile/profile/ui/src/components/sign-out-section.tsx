import { AppText, Button, Card } from '@mobile/shared/ui';
import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export interface SignOutSectionProps {
  /** Orders and drafts still waiting to be sent; signing out deletes them with the other device data. */
  queuedCount: number;
  onSignOut: () => void;
}

/** «Вийти»; with a non-empty queue it first warns that the queued work will be lost (SC-023). */
export function SignOutSection({ onSignOut, queuedCount }: Readonly<SignOutSectionProps>) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <Button
        label="Вийти"
        onPress={() => (queuedCount > 0 ? setConfirming(true) : onSignOut())}
        variant="destructive"
      />
    );
  }

  return (
    <Card accessibilityRole="alert" style={styles.card}>
      <AppText tone="error" variant="bodyStrong">
        {`Невідправлених у черзі: ${queuedCount}`}
      </AppText>
      <AppText variant="body">
        Після виходу вони зникнуть з телефона і не потраплять у 1С. Дочекайтеся мережі, щоб черга
        відправилась.
      </AppText>
      <View style={styles.actions}>
        <Button label="Залишитися" onPress={() => setConfirming(false)} variant="text" />
        <Button label="Вийти все одно" onPress={onSignOut} variant="destructive" />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create((theme) => ({
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.sm,
    justifyContent: 'flex-end',
  },
  card: { gap: theme.space.sm },
}));
