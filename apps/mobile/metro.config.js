const path = require('node:path');

const { mergeConfig } = require('@expo/metro/metro-config');
// Expo SDK 55+ ships Metro via `@expo/metro`. `getDefaultConfig` and
// `mergeConfig` must come from the Expo-provided Metro instance.
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const customConfig = {
  cacheVersion: 'mobile',
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
  },
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'cjs', 'mjs', 'svg'],
  },
};

const workspaceRoot = path.resolve(__dirname, '../..');
const workspaceAliases = {
  '@mobile/shared/api-client': path.join(
    workspaceRoot,
    'libs/mobile/shared/api-client/src/index.ts',
  ),
  '@mobile/shared/config': path.join(workspaceRoot, 'libs/mobile/shared/config/src/index.ts'),
  '@mobile/shared/ui': path.join(workspaceRoot, 'libs/mobile/shared/ui/src/index.ts'),
  '@mobile/shared/util': path.join(workspaceRoot, 'libs/mobile/shared/util/src/index.ts'),
  '@mobile/core/connectivity': path.join(
    workspaceRoot,
    'libs/mobile/core/connectivity/src/index.ts',
  ),
  '@mobile/core/shell': path.join(workspaceRoot, 'libs/mobile/core/shell/src/index.ts'),
};

const config = mergeConfig(defaultConfig, customConfig);

config.resolver.resolveRequest = (context, moduleName, platform) =>
  context.resolveRequest(context, workspaceAliases[moduleName] ?? moduleName, platform);

module.exports = config;
