import { formatKopecks } from '@mobile/shared/model';
import { AppText, Button, TextField } from '@mobile/shared/ui';
import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export interface ConfirmSendProps {
  customerName: string;
  isOnline: boolean | null;
  lineCount: number;
  totalKopecks: number;
  onCancel: () => void;
  onConfirm: () => void;
}

/** The manager confirms the total before the order goes to 1C (SC-015); offline it waits in the queue (SC-016). */
export function ConfirmSend({
  customerName,
  isOnline,
  lineCount,
  onCancel,
  onConfirm,
  totalKopecks,
}: Readonly<ConfirmSendProps>) {
  return (
    <View accessibilityRole="alert" style={styles.step}>
      <AppText variant="bodyStrong">{`Відправити замовлення для ${customerName}?`}</AppText>
      <AppText numeric variant="total">
        {formatKopecks(totalKopecks)}
      </AppText>
      <AppText tone="secondary" variant="secondary">
        {`${lineCount} поз.`}
        {isOnline === true ? '' : ' · Без мережі замовлення стане в чергу і відправиться само.'}
      </AppText>
      <View style={styles.actions}>
        <Button label="Скасувати" onPress={onCancel} variant="text" />
        <Button icon="send" label="Так, відправити" onPress={onConfirm} />
      </View>
    </View>
  );
}

export interface SaveDraftFormProps {
  initialTitle: string;
  onCancel: () => void;
  onSave: (title: string) => void;
}

/** A draft gets a name; an opened draft keeps its own (R-010). */
export function SaveDraftForm({ initialTitle, onCancel, onSave }: Readonly<SaveDraftFormProps>) {
  const [title, setTitle] = useState(initialTitle);
  const trimmed = title.trim();
  return (
    <View style={styles.step}>
      <TextField
        autoFocus
        error={trimmed.length > 200 ? 'Не довше 200 символів' : null}
        label="Назва чернетки"
        onChangeText={setTitle}
        value={title}
      />
      <View style={styles.actions}>
        <Button label="Скасувати" onPress={onCancel} variant="text" />
        <Button
          disabled={trimmed.length === 0 || trimmed.length > 200}
          icon="content-save-outline"
          label="Зберегти чернетку"
          onPress={() => onSave(trimmed)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  actions: { flexDirection: 'row', gap: theme.space.sm, justifyContent: 'flex-end' },
  step: {
    borderColor: theme.colors.outlineVariant,
    borderTopWidth: theme.sizes.border,
    gap: theme.space.sm,
    paddingTop: theme.space.md,
  },
}));
