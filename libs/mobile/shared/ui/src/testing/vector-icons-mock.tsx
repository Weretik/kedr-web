// Jest only: icon fonts are not loaded in tests, so icons render as an empty view.
jest.mock('@expo/vector-icons', () => {
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  const MaterialCommunityIcons = () => <View />;
  return { MaterialCommunityIcons };
});
