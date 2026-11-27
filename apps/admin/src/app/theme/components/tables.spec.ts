import { describe, expect, it } from 'vitest';

import { adminTableComponents } from './tables';

describe('adminTableComponents', () => {
  it('caps every table to the window height and pins its header', () => {
    const container = adminTableComponents.MuiTableContainer.styleOverrides.root;

    expect(container).toMatchObject({ maxHeight: 'calc(100dvh - 224px)', overflow: 'auto' });
    expect(adminTableComponents.MuiDataGrid.styleOverrides.root).toBeTypeOf('function');
  });
});
