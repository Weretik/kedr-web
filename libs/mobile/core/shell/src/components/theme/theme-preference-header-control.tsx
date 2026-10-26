import { KedrSheet, RoundIconButton, useKedrTheme } from '@mobile/shared/ui';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, Icon, Text } from 'react-native-paper';

import { useThemePreference } from '../../providers/theme-preference-context';
import { type ThemePreference } from '../../storage/theme-preference-storage';

const preferences: readonly { icon: string; label: string; value: ThemePreference }[] = [
  { icon: 'white-balance-sunny', label: 'Світла', value: 'light' },
  { icon: 'weather-night', label: 'Темна', value: 'dark' },
  { icon: 'theme-light-dark', label: 'Системна', value: 'system' },
];

export function ThemePreferenceHeaderControl({
  tone = 'surface',
}: Readonly<{ tone?: 'onPrimary' | 'surface' }>) {
  const [isVisible, setIsVisible] = useState(false);
  const [draftPreference, setDraftPreference] = useState<ThemePreference>('system');
  const { kedr } = useKedrTheme();
  const { preference, setPreference } = useThemePreference();

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
      <RoundIconButton
        accessibilityLabel="Змінити тему оформлення"
        icon="theme-light-dark"
        onPress={openSheet}
        tone={tone}
      />
      <KedrSheet onDismiss={closeSheet} title="Виберіть тему" visible={isVisible}>
        <View style={styles.content}>
          <View style={styles.options}>
            {preferences.map(({ icon, label, value }) => {
              const isSelected = draftPreference === value;
              return (
                <Pressable
                  accessibilityLabel={`Тема: ${label}`}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                  key={value}
                  onPress={() => setDraftPreference(value)}
                  style={[
                    styles.option,
                    {
                      backgroundColor: isSelected
                        ? kedr.colors.inverseSurface
                        : kedr.colors.surfaceVariant,
                      borderRadius: kedr.radius.lg,
                    },
                  ]}
                >
                  <Icon
                    color={isSelected ? kedr.colors.inverseOnSurface : kedr.colors.primary}
                    size={24}
                    source={icon}
                  />
                  <Text
                    style={{
                      color: isSelected ? kedr.colors.inverseOnSurface : kedr.colors.onSurface,
                    }}
                    variant="labelLarge"
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Button
            buttonColor={kedr.colors.primary}
            contentStyle={styles.saveButtonContent}
            mode="contained"
            onPress={savePreference}
            textColor={kedr.colors.onPrimary}
          >
            Зберегти
          </Button>
        </View>
      </KedrSheet>
    </>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16, padding: 16, paddingTop: 4 },
  option: {
    alignItems: 'center',
    flex: 1,
    gap: 8,
    minHeight: 88,
    justifyContent: 'center',
    padding: 12,
  },
  options: { flexDirection: 'row', gap: 8 },
  saveButtonContent: { minHeight: 48 },
});
