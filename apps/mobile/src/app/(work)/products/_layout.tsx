import { Stack } from 'expo-router';

/** The section's screens; a calculation line opens as a native sheet over the list. */
export default function SectionLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="line/[productId]"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.75, 1],
          sheetGrabberVisible: true,
        }}
      />
    </Stack>
  );
}
