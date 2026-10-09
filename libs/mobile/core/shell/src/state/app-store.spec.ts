import { createAppStore } from './app-store';

describe('shell appStore', () => {
  it('contains only domain-neutral reducers', () => {
    const store = createAppStore();

    expect(Object.keys(store.getState()).sort()).toEqual(['mobileApi', 'themePreference']);
  });
});
