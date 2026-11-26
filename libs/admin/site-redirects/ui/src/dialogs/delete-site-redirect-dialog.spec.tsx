import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DeleteSiteRedirectDialog } from './delete-site-redirect-dialog';

describe('DeleteSiteRedirectDialog', () => {
  it('names the redirect and confirms', () => {
    const onConfirm = vi.fn();
    render(
      <DeleteSiteRedirectDialog
        deleting={false}
        onCancel={vi.fn()}
        onConfirm={onConfirm}
        redirect={{
          id: 1,
          from: '/uk/old',
          to: '/uk/new',
          updatedAt: '2026-11-26T10:00:00Z',
          updatedBy: 'seo',
          version: 1,
        }}
      />,
    );

    expect(screen.getByText(/\/uk\/old → \/uk\/new/)).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'Видалити' }));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('is closed without a redirect', () => {
    render(
      <DeleteSiteRedirectDialog
        deleting={false}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
        redirect={null}
      />,
    );
    expect(screen.queryByText('Видалити переадресацію?')).toBeNull();
  });
});
