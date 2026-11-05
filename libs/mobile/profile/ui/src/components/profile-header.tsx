import { AppText, Avatar, Button, Card } from '@mobile/shared/ui';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export interface ProfileHeaderProps {
  name: string;
  email: string;
  roleLabel: string;
  avatarUrl: string | null;
  /** Photo changes need the network. */
  canEdit: boolean;
  busy: boolean;
  onChangePhoto: () => void;
  onRemovePhoto: () => void;
}

/** Photo or initials, name, role and e-mail, with «Змінити фото» (R-016, SC-021). */
export function ProfileHeader({
  avatarUrl,
  busy,
  canEdit,
  email,
  name,
  onChangePhoto,
  onRemovePhoto,
  roleLabel,
}: Readonly<ProfileHeaderProps>) {
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Avatar name={name} photoUrl={avatarUrl} size={72} />
        <View style={styles.text}>
          <AppText accessibilityRole="header" variant="sectionTitle">
            {name}
          </AppText>
          <AppText tone="secondary" variant="secondary">
            {roleLabel}
          </AppText>
          <AppText selectable tone="secondary" variant="secondary">
            {email}
          </AppText>
        </View>
      </View>
      <View style={styles.actions}>
        <Button
          disabled={!canEdit}
          icon="camera-outline"
          label="Змінити фото"
          loading={busy}
          onPress={onChangePhoto}
          variant="outlined"
        />
        {avatarUrl ? (
          <Button
            disabled={!canEdit || busy}
            label="Прибрати фото"
            onPress={onRemovePhoto}
            variant="text"
          />
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create((theme) => ({
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm },
  card: { gap: theme.space.md },
  row: { alignItems: 'center', flexDirection: 'row', gap: theme.space.md },
  text: { flex: 1, gap: 2 },
}));
