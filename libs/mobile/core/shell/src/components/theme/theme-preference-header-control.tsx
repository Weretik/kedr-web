import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import ActionSheet, { type ActionSheetRef } from 'react-native-actions-sheet';
import { Button, Divider, IconButton, RadioButton, Text, useTheme } from 'react-native-paper';

import { useThemePreference } from '../../providers/theme-preference-context';
import { type ThemePreference } from '../../storage/theme-preference-storage';

const preferences: readonly {
  color: 'light' | 'dark' | 'system';
  label: string;
  value: ThemePreference;
}[] = [
  { color: 'light', label: 'Світла', value: 'light' },
  { color: 'dark', label: 'Темна', value: 'dark' },
  { color: 'system', label: 'Системна', value: 'system' },
];

export function ThemePreferenceHeaderControl() {
  const [isVisible, setIsVisible] = useState(false);
  const [draftPreference, setDraftPreference] = useState<ThemePreference>('system');
  const ref = useRef<ActionSheetRef>(null);
  const wasVisible = useRef(false);
  const theme = useTheme();
  const systemColorScheme = useColorScheme();
  const { preference, setPreference } = useThemePreference();
  const colorMarkers = {
    dark: styles.darkMarker,
    light: styles.lightMarker,
    system: systemColorScheme === 'dark' ? styles.darkMarker : styles.lightMarker,
  };

  useEffect(() => {
    if (isVisible) ref.current?.show();
    else if (wasVisible.current) ref.current?.hide();
    wasVisible.current = isVisible;
  }, [isVisible]);

  const openSheet = () => {
    setDraftPreference(preference);
    setIsVisible(true);
  };

  const closeSheet = () => setIsVisible(false);

  const savePreference = () => {
    setPreference(draftPreference);
    closeSheet();
  };

  return (
    <>
      <IconButton
        accessibilityLabel="Змінити тему оформлення"
        icon="theme-light-dark"
        onPress={openSheet}
      />
      <ActionSheet
        closeOnTouchBackdrop
        containerStyle={{ backgroundColor: theme.colors.background }}
        gestureEnabled
        onClose={closeSheet}
        ref={ref}
      >
        <View style={styles.content}>
          <Text
            accessibilityRole="header"
            style={[styles.title, { color: theme.colors.onSurface }]}
            variant="titleLarge"
          >
            Виберіть тему
          </Text>

          <View style={[styles.options, { backgroundColor: theme.colors.surfaceVariant }]}>
            {preferences.map(({ color, label, value }, index) => {
              const isSelected = draftPreference === value;

              return (
                <View key={value}>
                  {index > 0 ? <Divider style={styles.divider} /> : null}
                  <Pressable
                    accessibilityLabel={`Тема: ${label}`}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isSelected }}
                    onPress={() => setDraftPreference(value)}
                    style={styles.option}
                  >
                    <View style={[styles.colorMarker, colorMarkers[color]]} />
                    <Text
                      style={[styles.optionLabel, { color: theme.colors.onSurface }]}
                      variant="bodyLarge"
                    >
                      {label}
                    </Text>
                    <RadioButton.Android
                      color={theme.colors.primary}
                      status={isSelected ? 'checked' : 'unchecked'}
                      value={value}
                    />
                  </Pressable>
                </View>
              );
            })}
          </View>

          <Button
            buttonColor={theme.colors.primary}
            contentStyle={styles.saveButtonContent}
            mode="contained"
            onPress={savePreference}
            style={styles.saveButton}
            textColor={theme.colors.onPrimary}
          >
            Зберегти
          </Button>
        </View>
      </ActionSheet>
    </>
  );
}

const styles = StyleSheet.create({
  colorMarker: { borderRadius: 14, height: 28, marginRight: 20, width: 28 },
  content: { padding: 24, paddingTop: 12 },
  darkMarker: { backgroundColor: '#202124' },
  divider: { marginLeft: 80 },
  lightMarker: { backgroundColor: '#ffffff', borderColor: '#4b5563', borderWidth: 1 },
  option: { alignItems: 'center', flexDirection: 'row', minHeight: 50, paddingHorizontal: 20 },
  optionLabel: { flex: 1 },
  options: { borderRadius: 12, marginTop: 22, overflow: 'hidden' },
  saveButton: { marginTop: 16 },
  saveButtonContent: { minHeight: 44 },
  title: { marginTop: 12 },
});
