module.exports = function (api) {
  api.cache(true);
  const isTest = process.env.NODE_ENV === 'test';

  return {
    presets: ['babel-preset-expo'],
    // Unistyles' Babel plugin runs in the app; Jest uses the Unistyles mocks instead.
    plugins: isTest ? [] : [['react-native-unistyles/plugin', { root: 'src' }]],
  };
};
