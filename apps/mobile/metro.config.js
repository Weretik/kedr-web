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
  '@mobile/shared/model': path.join(workspaceRoot, 'libs/mobile/shared/model/src/index.ts'),
  '@mobile/shared/ui': path.join(workspaceRoot, 'libs/mobile/shared/ui/src/index.ts'),
  '@mobile/calculation/data-access': path.join(
    workspaceRoot,
    'libs/mobile/calculation/data-access/src/index.ts',
  ),
  '@mobile/calculation/feature': path.join(
    workspaceRoot,
    'libs/mobile/calculation/feature/src/index.ts',
  ),
  '@mobile/calculation/model': path.join(
    workspaceRoot,
    'libs/mobile/calculation/model/src/index.ts',
  ),
  '@mobile/calculation/ui': path.join(workspaceRoot, 'libs/mobile/calculation/ui/src/index.ts'),
  '@mobile/orders/data-access': path.join(
    workspaceRoot,
    'libs/mobile/orders/data-access/src/index.ts',
  ),
  '@mobile/orders/feature': path.join(workspaceRoot, 'libs/mobile/orders/feature/src/index.ts'),
  '@mobile/orders/model': path.join(workspaceRoot, 'libs/mobile/orders/model/src/index.ts'),
  '@mobile/catalog/data-access': path.join(
    workspaceRoot,
    'libs/mobile/catalog/data-access/src/index.ts',
  ),
  '@mobile/catalog/feature': path.join(workspaceRoot, 'libs/mobile/catalog/feature/src/index.ts'),
  '@mobile/catalog/model': path.join(workspaceRoot, 'libs/mobile/catalog/model/src/index.ts'),
  '@mobile/catalog/ui': path.join(workspaceRoot, 'libs/mobile/catalog/ui/src/index.ts'),
  '@mobile/core/auth': path.join(workspaceRoot, 'libs/mobile/core/auth/src/index.ts'),
  '@mobile/core/connectivity': path.join(
    workspaceRoot,
    'libs/mobile/core/connectivity/src/index.ts',
  ),
  '@mobile/core/local-db': path.join(workspaceRoot, 'libs/mobile/core/local-db/src/index.ts'),
  '@mobile/core/shell': path.join(workspaceRoot, 'libs/mobile/core/shell/src/index.ts'),
  '@mobile/customers/data-access': path.join(
    workspaceRoot,
    'libs/mobile/customers/data-access/src/index.ts',
  ),
  '@mobile/customers/feature': path.join(
    workspaceRoot,
    'libs/mobile/customers/feature/src/index.ts',
  ),
  '@mobile/customers/model': path.join(workspaceRoot, 'libs/mobile/customers/model/src/index.ts'),
  '@mobile/customers/ui': path.join(workspaceRoot, 'libs/mobile/customers/ui/src/index.ts'),
  '@mobile/sync/data-access': path.join(workspaceRoot, 'libs/mobile/sync/data-access/src/index.ts'),
  '@mobile/sync/feature': path.join(workspaceRoot, 'libs/mobile/sync/feature/src/index.ts'),
  '@mobile/sync/model': path.join(workspaceRoot, 'libs/mobile/sync/model/src/index.ts'),
  '@shared/api-contracts': path.join(workspaceRoot, 'libs/shared/api-contracts/src/index.ts'),
};

const config = mergeConfig(defaultConfig, customConfig);

config.resolver.resolveRequest = (context, moduleName, platform) =>
  context.resolveRequest(context, workspaceAliases[moduleName] ?? moduleName, platform);

module.exports = config;
