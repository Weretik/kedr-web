import 'react-native-gesture-handler/jestSetup';

jest.mock('expo/src/winter/ImportMetaRegistry', () => ({
  ImportMetaRegistry: {
    get url() {
      return null;
    },
  },
}));

// Expo SDK 55+ installs lazy winter-runtime globals (fetch, URL, etc.) that
// require files Jest treats as "outside of the scope of the test code" in a
// monorepo. Replace them with the runtime's own globals so the lazy getters
// never fire during tests.
const defineGlobal = (name: string, value: unknown) => {
  try {
    Object.defineProperty(global, name, {
      value,
      configurable: true,
      writable: true,
    });
  } catch {
    // Ignore environments that don't allow redefining these globals.
  }
};
defineGlobal('fetch', globalThis.fetch);
defineGlobal('Headers', globalThis.Headers);
defineGlobal('Request', globalThis.Request);
defineGlobal('Response', globalThis.Response);
defineGlobal('FormData', globalThis.FormData);
defineGlobal('URL', globalThis.URL);
defineGlobal('URLSearchParams', globalThis.URLSearchParams);

if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (object) => JSON.parse(JSON.stringify(object));
}

// The native random source is not in Jest; Node's gives the queue real ids.
jest.mock('expo-crypto', () => ({ randomUUID: () => jest.requireActual('crypto').randomUUID() }));

// Reanimated does not start under Jest: a swipeable row renders its content and its actions side by side.
jest.mock('react-native-gesture-handler/ReanimatedSwipeable', () => {
  const { createElement } = jest.requireActual('react');
  const { View } = jest.requireActual('react-native');
  return {
    __esModule: true,
    default: ({
      children,
      renderRightActions,
    }: {
      children: unknown;
      renderRightActions?: () => unknown;
    }) => createElement(View, null, children, renderRightActions?.()),
  };
});
