import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { IconButton, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface CatalogSearchSheetProps {
  history: readonly string[];
  onApply: () => void;
  onChange: (value: string) => void;
  onClearHistory: () => void;
  onDismiss: () => void;
  onRemoveHistory: (phrase: string) => void;
  onSelectHistory: (phrase: string) => void;
  value: string;
  visible: boolean;
}

export function CatalogSearchSheet({
  history,
  onApply,
  onChange,
  onClearHistory,
  onDismiss,
  onRemoveHistory,
  onSelectHistory,
  value,
  visible,
}: Readonly<CatalogSearchSheetProps>) {
  const theme = useTheme();
  const right = (
    <View style={styles.trailingActions}>
      {value ? (
        <IconButton
          accessibilityLabel="Очистити пошуковий текст"
          icon="close"
          iconColor={theme.colors.onSurfaceVariant}
          onPress={() => onChange('')}
          size={20}
        />
      ) : null}
      <IconButton
        accessibilityLabel="Шукати товари"
        icon="magnify"
        iconColor={theme.colors.primary}
        onPress={onApply}
        size={22}
      />
    </View>
  );

  return (
    <Modal animationType="slide" onRequestClose={onDismiss} visible={visible}>
      <SafeAreaView
        edges={['top', 'right', 'bottom', 'left']}
        style={{ backgroundColor: theme.colors.surface, flex: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.select({ android: 'height', ios: 'padding' })}
          style={styles.keyboardArea}
        >
          <View style={styles.header}>
            <IconButton accessibilityLabel="Закрити пошук" icon="arrow-left" onPress={onDismiss} />
            <Text style={styles.title} variant="titleLarge">
              Пошук товарів
            </Text>
            <View style={styles.headerSpacer} />
          </View>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            testID="catalog-search-sheet"
          >
            <TextInput
              accessibilityLabel="Пошук товарів"
              activeUnderlineColor="transparent"
              autoFocus={visible}
              contentStyle={styles.searchInputContent}
              left={<TextInput.Icon color={theme.colors.onSurfaceVariant} icon="magnify" />}
              mode="flat"
              onChangeText={onChange}
              onSubmitEditing={onApply}
              returnKeyType="search"
              right={right}
              style={[styles.searchInput, { backgroundColor: theme.colors.surfaceVariant }]}
              underlineColor="transparent"
              value={value}
            />
            <View style={styles.historyHeader}>
              <Text variant="titleMedium">Нещодавні пошуки</Text>
              {history.length ? (
                <Pressable accessibilityLabel="Очистити історію пошуку" onPress={onClearHistory}>
                  <Text style={{ color: theme.colors.primary }} variant="labelLarge">
                    Очистити
                  </Text>
                </Pressable>
              ) : null}
            </View>
            {history.length === 0 ? (
              <Text
                accessibilityLabel="Нещодавніх пошуків немає"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Нещодавніх пошуків немає
              </Text>
            ) : (
              <View style={styles.history}>
                {history.map((phrase) => (
                  <HistoryRow
                    key={phrase}
                    onRemove={() => onRemoveHistory(phrase)}
                    onSelect={() => onSelectHistory(phrase)}
                    phrase={phrase}
                  />
                ))}
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

function HistoryRow({
  onRemove,
  onSelect,
  phrase,
}: Readonly<{ onRemove: () => void; onSelect: () => void; phrase: string }>) {
  const theme = useTheme();
  return (
    <View style={styles.historyRow}>
      <Pressable
        accessibilityLabel={`Шукати: ${phrase}`}
        onPress={onSelect}
        style={styles.historyText}
      >
        <Text numberOfLines={1} style={{ color: theme.colors.onSurface }} variant="bodyLarge">
          {phrase}
        </Text>
      </Pressable>
      <IconButton
        accessibilityLabel={`Видалити пошук: ${phrase}`}
        icon="close"
        iconColor={theme.colors.onSurfaceVariant}
        onPress={onRemove}
        size={20}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16, padding: 20, paddingBottom: 32 },
  header: { alignItems: 'center', flexDirection: 'row', minHeight: 56, paddingHorizontal: 4 },
  headerSpacer: { width: 48 },
  history: { gap: 4 },
  historyHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  historyRow: { alignItems: 'center', flexDirection: 'row', minHeight: 48 },
  historyText: { flex: 1, paddingVertical: 8 },
  keyboardArea: { flex: 1 },
  searchInput: { borderRadius: 28, height: 56, overflow: 'hidden' },
  searchInputContent: { fontSize: 16, paddingBottom: 0, paddingTop: 0 },
  title: { flex: 1, textAlign: 'center' },
  trailingActions: { alignItems: 'center', flexDirection: 'row' },
});
