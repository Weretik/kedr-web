import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SiteModelPanelsContext, useSiteModelPanels } from './site-model-panels-context';

import type { SiteModelPanels } from './site-model-panels-context';
import type { ReactNode } from 'react';

describe('useSiteModelPanels', () => {
  it('gives the panels of the provider', () => {
    const panels: SiteModelPanels = {
      openEditModel: vi.fn(),
      openNewModel: vi.fn(),
      openAddToModel: vi.fn(),
    };
    const wrapper = ({ children }: { children: ReactNode }) => (
      <SiteModelPanelsContext.Provider value={panels}>{children}</SiteModelPanelsContext.Provider>
    );
    expect(renderHook(() => useSiteModelPanels(), { wrapper }).result.current).toBe(panels);
  });

  it('fails loudly outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderHook(() => useSiteModelPanels())).toThrow(/SiteModelPanelsProvider/);
  });
});
